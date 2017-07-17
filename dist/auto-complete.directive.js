"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auto_complete_component_1 = require("./auto-complete.component");
var forms_1 = require("@angular/forms");
/**
 * display auto-complete section with input and dropdown list when it is clicked
 */
var NguiAutoCompleteDirective = (function () {
    function NguiAutoCompleteDirective(resolver, renderer, viewContainerRef, parentForm) {
        var _this = this;
        this.resolver = resolver;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.parentForm = parentForm;
        this.loadingTemplate = null;
        this.loadingText = "Loading";
        this.tabToSelect = true;
        this.matchFormatted = false;
        this.zIndex = "1";
        this.ngModelChange = new core_1.EventEmitter();
        this.valueChanged = new core_1.EventEmitter();
        //show auto-complete list below the current element
        this.showAutoCompleteDropdown = function (event) {
            _this.hideAutoCompleteDropdown();
            _this.scheduledBlurHandler = null;
            var factory = _this.resolver.resolveComponentFactory(auto_complete_component_1.NguiAutoCompleteComponent);
            _this.componentRef = _this.viewContainerRef.createComponent(factory);
            var component = _this.componentRef.instance;
            component.showInputTag = false; //Do NOT display autocomplete input tag separately
            component.pathToData = _this.pathToData;
            component.minChars = _this.minChars;
            component.source = _this.source;
            component.placeholder = _this.autoCompletePlaceholder;
            component.acceptUserInput = _this.acceptUserInput;
            component.maxNumList = parseInt(_this.maxNumList, 10);
            component.loadingText = _this.loadingText;
            component.loadingTemplate = _this.loadingTemplate;
            component.listFormatter = _this.listFormatter;
            component.blankOptionText = _this.blankOptionText;
            component.noMatchFoundText = _this.noMatchFoundText;
            component.tabToSelect = _this.tabToSelect;
            component.matchFormatted = _this.matchFormatted;
            component.valueSelected.subscribe(_this.selectNewValue);
            _this.acDropdownEl = _this.componentRef.location.nativeElement;
            _this.acDropdownEl.style.display = "none";
            // if this element is not an input tag, move dropdown after input tag
            // so that it displays correctly
            if (_this.el.tagName !== "INPUT" && _this.acDropdownEl) {
                _this.inputEl.parentElement.insertBefore(_this.acDropdownEl, _this.inputEl.nextSibling);
            }
            _this.revertValue = typeof _this.ngModel !== "undefined" ? _this.ngModel : _this.inputEl.value;
            setTimeout(function () {
                component.reloadList(_this.inputEl.value);
                _this.styleAutoCompleteDropdown();
                component.dropdownVisible = true;
            });
        };
        this.hideAutoCompleteDropdown = function (event) {
            if (_this.componentRef) {
                var currentItem = void 0;
                var hasRevertValue = (typeof _this.revertValue !== "undefined");
                if (_this.inputEl && hasRevertValue && _this.acceptUserInput === false) {
                    currentItem = _this.componentRef.instance.findItemFromSelectValue(_this.inputEl.value);
                }
                _this.componentRef.destroy();
                _this.componentRef = undefined;
                if (_this.inputEl &&
                    hasRevertValue &&
                    _this.acceptUserInput === false &&
                    currentItem === null) {
                    _this.selectNewValue(_this.revertValue);
                }
            }
        };
        this.styleAutoCompleteDropdown = function () {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                /* setting width/height auto complete */
                var thisElBCR = _this.el.getBoundingClientRect();
                var thisInputElBCR = _this.inputEl.getBoundingClientRect();
                var closeToBottom = thisInputElBCR.bottom + 100 > window.innerHeight;
                _this.acDropdownEl.style.width = thisInputElBCR.width + "px";
                _this.acDropdownEl.style.position = "absolute";
                _this.acDropdownEl.style.zIndex = _this.zIndex;
                _this.acDropdownEl.style.left = "0";
                _this.acDropdownEl.style.display = "inline-block";
                if (closeToBottom) {
                    _this.acDropdownEl.style.bottom = thisInputElBCR.height + "px";
                }
                else {
                    _this.acDropdownEl.style.top = thisInputElBCR.height + "px";
                }
            }
        };
        this.selectNewValue = function (item) {
            // make displayable value
            if (item && typeof item === "object") {
                item = _this.setToStringFunction(item);
            }
            _this.renderValue(item);
            // make return value
            var val = item;
            if (_this.selectValueOf && item[_this.selectValueOf]) {
                val = item[_this.selectValueOf];
            }
            if ((_this.parentForm && _this.formControlName) || _this.extFormControl) {
                if (!!val) {
                    _this.formControl.patchValue(val);
                }
            }
            (val !== _this.ngModel) && _this.ngModelChange.emit(val);
            _this.valueChanged.emit(val);
            _this.hideAutoCompleteDropdown();
        };
        this.keydownEventHandler = function (evt) {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                component.inputElKeyHandler(evt);
            }
        };
        this.inputEventHandler = function (evt) {
            if (_this.componentRef) {
                var component = _this.componentRef.instance;
                component.dropdownVisible = true;
                component.reloadListInDelay(evt);
            }
            else {
                _this.showAutoCompleteDropdown();
            }
        };
        this.el = this.viewContainerRef.element.nativeElement;
    }
    NguiAutoCompleteDirective.prototype.ngOnInit = function () {
        var _this = this;
        // Blur event is handled only after a click event. This is to prevent handling of blur events resulting from interacting with a scrollbar
        // introduced by content overflow (Internet explorer issue).
        // See issue description here: http://stackoverflow.com/questions/2023779/clicking-on-a-divs-scroll-bar-fires-the-blur-event-in-ie
        this.documentClickListener = function (e) {
            if (_this.scheduledBlurHandler) {
                _this.scheduledBlurHandler();
                _this.scheduledBlurHandler = null;
            }
        };
        document.addEventListener('click', this.documentClickListener);
        // wrap this element with <div class="ngui-auto-complete">
        this.wrapperEl = document.createElement("div");
        this.wrapperEl.className = "ngui-auto-complete-wrapper";
        this.wrapperEl.style.position = "relative";
        this.el.parentElement.insertBefore(this.wrapperEl, this.el.nextSibling);
        this.wrapperEl.appendChild(this.el);
        //Check if we were supplied with a [formControlName] and it is inside a [form]
        //else check if we are supplied with a [FormControl] regardless if it is inside a [form] tag
        if (this.parentForm && this.formControlName) {
            if (this.parentForm['form']) {
                this.formControl = this.parentForm['form'].get(this.formControlName);
            }
            else if (this.parentForm instanceof forms_1.FormGroupName) {
                this.formControl = this.parentForm.control.controls[this.formControlName];
            }
        }
        else if (this.extFormControl) {
            this.formControl = this.extFormControl;
        }
        // apply toString() method for the object
        if (!!this.ngModel) {
            this.selectNewValue(this.ngModel);
        }
        else if (!!this.formControl && this.formControl.value) {
            this.selectNewValue(this.formControl.value[this.displayPropertyName]);
        }
    };
    NguiAutoCompleteDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        // if this element is not an input tag, move dropdown after input tag
        // so that it displays correctly
        this.inputEl = this.el.tagName === "INPUT" ?
            this.el : this.el.querySelector("input");
        this.inputEl.addEventListener('focus', function (e) { return _this.showAutoCompleteDropdown(e); });
        this.inputEl.addEventListener('blur', function (e) {
            _this.scheduledBlurHandler = _this.hideAutoCompleteDropdown;
        });
        this.inputEl.addEventListener('keydown', function (e) { return _this.keydownEventHandler(e); });
        this.inputEl.addEventListener('input', function (e) { return _this.inputEventHandler(e); });
    };
    NguiAutoCompleteDirective.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.instance.valueSelected.unsubscribe();
        }
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
        }
    };
    NguiAutoCompleteDirective.prototype.ngOnChanges = function (changes) {
        if (changes['ngModel']) {
            this.ngModel = this.setToStringFunction(changes['ngModel'].currentValue);
            this.renderValue(this.ngModel);
        }
    };
    NguiAutoCompleteDirective.prototype.setToStringFunction = function (item) {
        if (item && typeof item === "object") {
            var displayVal_1;
            if (typeof this.valueFormatter === 'string') {
                var matches = this.valueFormatter.match(/[a-zA-Z0-9_\$]+/g);
                var formatted_1 = this.valueFormatter;
                if (matches && typeof item !== 'string') {
                    matches.forEach(function (key) {
                        formatted_1 = formatted_1.replace(key, item[key]);
                    });
                }
                displayVal_1 = formatted_1;
            }
            else if (typeof this.valueFormatter === 'function') {
                displayVal_1 = this.valueFormatter(item);
            }
            else if (this.displayPropertyName) {
                displayVal_1 = item[this.displayPropertyName];
            }
            else if (typeof this.listFormatter === 'string' && this.listFormatter.match(/^\w+$/)) {
                displayVal_1 = item[this.listFormatter];
            }
            else {
                displayVal_1 = item.value;
            }
            item.toString = function () { return displayVal_1; };
        }
        return item;
    };
    NguiAutoCompleteDirective.prototype.renderValue = function (item) {
        this.inputEl && (this.inputEl.value = '' + item);
    };
    return NguiAutoCompleteDirective;
}());
__decorate([
    core_1.Input("auto-complete-placeholder"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "autoCompletePlaceholder", void 0);
__decorate([
    core_1.Input("source"),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "source", void 0);
__decorate([
    core_1.Input("path-to-data"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "pathToData", void 0);
__decorate([
    core_1.Input("min-chars"),
    __metadata("design:type", Number)
], NguiAutoCompleteDirective.prototype, "minChars", void 0);
__decorate([
    core_1.Input("display-property-name"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "displayPropertyName", void 0);
__decorate([
    core_1.Input("accept-user-input"),
    __metadata("design:type", Boolean)
], NguiAutoCompleteDirective.prototype, "acceptUserInput", void 0);
__decorate([
    core_1.Input("max-num-list"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "maxNumList", void 0);
__decorate([
    core_1.Input("select-value-of"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "selectValueOf", void 0);
__decorate([
    core_1.Input("loading-template"),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "loadingTemplate", void 0);
__decorate([
    core_1.Input("list-formatter"),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "listFormatter", void 0);
__decorate([
    core_1.Input("loading-text"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "loadingText", void 0);
__decorate([
    core_1.Input("blank-option-text"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "blankOptionText", void 0);
__decorate([
    core_1.Input("no-match-found-text"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "noMatchFoundText", void 0);
__decorate([
    core_1.Input("value-formatter"),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "valueFormatter", void 0);
__decorate([
    core_1.Input("tab-to-select"),
    __metadata("design:type", Boolean)
], NguiAutoCompleteDirective.prototype, "tabToSelect", void 0);
__decorate([
    core_1.Input("match-formatted"),
    __metadata("design:type", Boolean)
], NguiAutoCompleteDirective.prototype, "matchFormatted", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "ngModel", void 0);
__decorate([
    core_1.Input('formControlName'),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "formControlName", void 0);
__decorate([
    core_1.Input('formControl'),
    __metadata("design:type", typeof (_a = typeof forms_1.FormControl !== "undefined" && forms_1.FormControl) === "function" && _a || Object)
], NguiAutoCompleteDirective.prototype, "extFormControl", void 0);
__decorate([
    core_1.Input("z-index"),
    __metadata("design:type", String)
], NguiAutoCompleteDirective.prototype, "zIndex", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "ngModelChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], NguiAutoCompleteDirective.prototype, "valueChanged", void 0);
NguiAutoCompleteDirective = __decorate([
    core_1.Directive({
        selector: "[auto-complete], [ngui-auto-complete]"
    }),
    __param(3, core_1.Optional()), __param(3, core_1.Host()), __param(3, core_1.SkipSelf()),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" && _b || Object, typeof (_c = typeof core_1.Renderer !== "undefined" && core_1.Renderer) === "function" && _c || Object, typeof (_d = typeof core_1.ViewContainerRef !== "undefined" && core_1.ViewContainerRef) === "function" && _d || Object, typeof (_e = typeof forms_1.ControlContainer !== "undefined" && forms_1.ControlContainer) === "function" && _e || Object])
], NguiAutoCompleteDirective);
exports.NguiAutoCompleteDirective = NguiAutoCompleteDirective;
var _a, _b, _c, _d, _e;
//# sourceMappingURL=auto-complete.directive.js.map