import * as $ from 'jquery';
import * as _ from 'lodash';
import Backbone from 'backbone';
import * as joint from 'jointjs';
/* Workaround to fix the missing global jointjs variable */ 
window.joint = joint; 
/* */
import CustomElement from '../../common/CustomHtmlElement'

export default CustomElement( ['field_name', 'field_constraints', 'field_date_type']);