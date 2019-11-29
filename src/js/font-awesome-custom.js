/**
 * @fileoverview Font Awesome 5
 * @link https://fontawesome.com/how-to-use/with-the-api/
 */

import { library, dom } from '@fortawesome/fontawesome-svg-core';

// Solid
// https://fontawesome.com/icons?d=gallery&s=solid&m=free
import {
    faBars,
    faBorderStyle,
    faCheck,
    faFlag,
    faInfoCircle,
    faExclamationTriangle,
    faTrash,
    faSearchPlus,
    faSearchMinus,
    faFolder,
    faGripHorizontal,
    faExpand,
    faArrowsAltH,
    faPrint, 
    faCaretRight,
    faFileCode,
    faBan,
    faPencilAlt,
    faChevronDown,
    faChevronRight,
    faPlus,
    faCheckCircle,
    faTrashAlt,
    faTimesCircle,
    faFileImport,
    faEdit,
    faStream,
    faSave,
    faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import {
    faFile,
    faFilePdf,
    faImage,
    faCaretSquareRight,
} from '@fortawesome/free-regular-svg-icons';


library.add(faBars, faBorderStyle, faCheck, faFlag, faInfoCircle, faExclamationTriangle,
    faTrash, faSearchPlus, faSearchMinus, faFolder, faGripHorizontal, faExpand,
    faArrowsAltH, faFile, faSave, faPrint, faFilePdf, faImage, faCaretRight, 
    faCaretSquareRight, faFileCode, faCheckCircle, faBan, faPencilAlt, faTrashAlt, faChevronDown,
    faChevronRight, faPlus, faTimesCircle, faFileImport, faEdit, faStream, faFolderOpen);


// automatically find any <i> tags in the page and replace those with <svg> elements
// https://fontawesome.com/how-to-use/with-the-api/methods/dom-i2svg
dom.i2svg();

// or

// if content is dynamic
// watch the DOM automatic for any additional icons being added or modified
// https://fontawesome.com/how-to-use/with-the-api/methods/dom-watch
// dom.watch()
