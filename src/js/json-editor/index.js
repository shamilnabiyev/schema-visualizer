// create the editor
import JSONEditor from "jsoneditor";

const container = document.getElementById("jsoneditor");
const options = {mode: 'code', search: false, statusBar: true, enableTransform: false, history: true};
const editor = new JSONEditor(container, options);

// set json

// get json
const updatedJson = editor.get();