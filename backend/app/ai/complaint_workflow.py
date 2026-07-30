from typing import Any

from app.config import get_settings

settings = get_settings()

END = "END"


class ComplaintState(dict):
    pass


class SimpleCompiledWorkflow:
    def __init__(self, nodes: list[tuple[str, Any]], entry_point: str, edges: list[tuple[str, str]]) -> None:
        self.nodes = nodes
        self.entry_point = entry_point
        self.edges = edges

    def invoke(self, state: ComplaintState | dict[str, Any]) -> ComplaintState:
        current = ComplaintState(state)
        current_node = self.entry_point

        while current_node != END:
            if current_node not in dict(self.nodes):
                break
            node_fn = dict(self.nodes)[current_node]
            current = node_fn(current)

            next_nodes = [target for source, target in self.edges if source == current_node]
            if not next_nodes:
                break
            current_node = next_nodes[0]

        return current


class SimpleStateGraph:
    def __init__(self, state_type: type[ComplaintState] | None = None) -> None:
        self.state_type = state_type or ComplaintState
        self.nodes: list[tuple[str, Any]] = []
        self.entry_point: str | None = None
        self.edges: list[tuple[str, str]] = []

    def add_node(self, name: str, func: Any) -> None:
        self.nodes.append((name, func))

    def set_entry_point(self, name: str) -> None:
        self.entry_point = name

    def add_edge(self, source: str, target: str) -> None:
        self.edges.append((source, target))

    def compile(self) -> SimpleCompiledWorkflow:
        if self.entry_point is None:
            raise ValueError("Entry point not set")
        return SimpleCompiledWorkflow(self.nodes, self.entry_point, self.edges)


def extract_complaint(state: ComplaintState) -> ComplaintState:
    text = state.get("text", "")
    state["extracted_data"] = {
        "customer_name": "",
        "complaint_source": "",
        "product_name": "",
        "product_strength": "",
        "batch_number": "",
        "manufacturing_date": "",
        "expiry_date": "",
        "quantity": "",
        "complaint_category": "",
        "complaint_description": text[:500],
        "severity": "moderate",
        "priority": "medium",
    }
    state["progress"] = 20
    return state


def validate_data(state: ComplaintState) -> ComplaintState:
    extracted = state.get("extracted_data", {})
    missing = []
    for field in ["customer_name", "complaint_description", "product_name", "batch_number"]:
        if not extracted.get(field):
            missing.append(field)
    state["missing_fields"] = missing
    state["progress"] = 40
    return state


def risk_classification(state: ComplaintState) -> ComplaintState:
    severity = state.get("extracted_data", {}).get("severity", "moderate")
    risk_badge = "High Risk" if severity in {"high", "critical"} else "Medium Risk"
    state["risk_badge"] = risk_badge
    state["confidence"] = 0.84
    state["progress"] = 60
    return state


def generate_summary(state: ComplaintState) -> ComplaintState:
    extracted = state.get("extracted_data", {})
    product_name = extracted.get("product_name") or "Unspecified product"
    batch_number = extracted.get("batch_number") or "Unspecified batch"
    summary = f"Complaint submitted for {product_name} from batch {batch_number}."
    state["summary"] = summary
    state["progress"] = 80
    return state


def suggest_missing_fields(state: ComplaintState) -> ComplaintState:
    state["suggested_values"] = state.get("extracted_data", {})
    state["progress"] = 100
    return state


def build_complaint_workflow() -> Any:
    try:
        from langgraph.graph import END as LANGGRAPH_END, StateGraph  # type: ignore

        workflow = StateGraph(ComplaintState)
        workflow.add_node("extract_complaint", extract_complaint)
        workflow.add_node("validate_data", validate_data)
        workflow.add_node("risk_classification", risk_classification)
        workflow.add_node("generate_summary", generate_summary)
        workflow.add_node("suggest_missing_fields", suggest_missing_fields)

        workflow.set_entry_point("extract_complaint")
        workflow.add_edge("extract_complaint", "validate_data")
        workflow.add_edge("validate_data", "risk_classification")
        workflow.add_edge("risk_classification", "generate_summary")
        workflow.add_edge("generate_summary", "suggest_missing_fields")
        workflow.add_edge("suggest_missing_fields", LANGGRAPH_END)

        return workflow.compile()
    except Exception:
        workflow = SimpleStateGraph(ComplaintState)
        workflow.add_node("extract_complaint", extract_complaint)
        workflow.add_node("validate_data", validate_data)
        workflow.add_node("risk_classification", risk_classification)
        workflow.add_node("generate_summary", generate_summary)
        workflow.add_node("suggest_missing_fields", suggest_missing_fields)

        workflow.set_entry_point("extract_complaint")
        workflow.add_edge("extract_complaint", "validate_data")
        workflow.add_edge("validate_data", "risk_classification")
        workflow.add_edge("risk_classification", "generate_summary")
        workflow.add_edge("generate_summary", "suggest_missing_fields")
        workflow.add_edge("suggest_missing_fields", END)

        return workflow.compile()


complaint_workflow = build_complaint_workflow()
