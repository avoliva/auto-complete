"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var auto_complete_component_1 = require("./auto-complete.component");
var auto_complete_directive_1 = require("./auto-complete.directive");
var auto_complete_1 = require("./auto-complete");
var NguiAutoCompleteModule = NguiAutoCompleteModule_1 = (function () {
    function NguiAutoCompleteModule() {
    }
    NguiAutoCompleteModule.forRoot = function () {
        return {
            ngModule: NguiAutoCompleteModule_1,
            providers: [auto_complete_1.NguiAutoComplete]
        };
    };
    return NguiAutoCompleteModule;
}());
NguiAutoCompleteModule = NguiAutoCompleteModule_1 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule],
        declarations: [auto_complete_component_1.NguiAutoCompleteComponent, auto_complete_directive_1.NguiAutoCompleteDirective],
        exports: [auto_complete_component_1.NguiAutoCompleteComponent, auto_complete_directive_1.NguiAutoCompleteDirective],
        entryComponents: [auto_complete_component_1.NguiAutoCompleteComponent]
    })
], NguiAutoCompleteModule);
exports.NguiAutoCompleteModule = NguiAutoCompleteModule;
var NguiAutoCompleteModule_1;
//# sourceMappingURL=auto-complete.module.js.map