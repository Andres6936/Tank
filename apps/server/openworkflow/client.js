import { BackendSqlite } from "openworkflow/sqlite";
import { OpenWorkflow } from "openworkflow";

export const backend = BackendSqlite.connect("openworkflow/backend.db");
export const ow = new OpenWorkflow({ backend });
