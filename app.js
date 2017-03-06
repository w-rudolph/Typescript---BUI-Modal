var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BUI;
(function (BUI) {
    var ModalSize;
    (function (ModalSize) {
        ModalSize[ModalSize["SM"] = 0] = "SM";
        ModalSize[ModalSize["MD"] = 1] = "MD";
        ModalSize[ModalSize["LG"] = 2] = "LG";
    })(ModalSize || (ModalSize = {}));
    var dialogBox = (function () {
        function dialogBox(options, fn) {
            this.options = {
                title: 'title',
                content: 'content',
                backdrop: true,
                vCenter: false,
                container: 'body',
                size: ModalSize.MD,
                selector: '#dialogBox'
            };
            this.options = $.extend(this.options, options);
            this.selector = this.options.selector;
            this.contents = [];
            this.render();
            this.fn = fn;
        }
        dialogBox.prototype.render = function () {
            var _this = this;
            if ($(this.selector).length)
                return;
            $(this.options.container).append(this.renderTpl());
            var $dialogBox = $(this.selector);
            $dialogBox.find('.modal-dialog').css('opacity', 0);
            this.updatePosition();
            $dialogBox.modal(this.options).on('shown.bs.modal', function () {
                $dialogBox.find('.modal-dialog').css('opacity', 1);
                _this.updatePosition();
                if (typeof _this.fn === 'function')
                    _this.fn();
            });
        };
        dialogBox.prototype.show = function () {
            var $dialogBox = $(this.selector);
            $dialogBox.modal('show');
        };
        dialogBox.prototype.hide = function () {
            var $dialogBox = $(this.selector);
            $dialogBox.modal('hide');
        };
        dialogBox.prototype.push = function (content) {
            var $dialogBox = $(this.selector);
            var $body = $dialogBox.find('.modal-body');
            var $title = $dialogBox.find('.modal-title');
            this.contents.push({ title: $title.html(), content: $body.html() });
            this.update(content);
            return this;
        };
        dialogBox.prototype.pop = function () {
            if (this.contents.length)
                this.update(this.contents.pop());
            else
                this.hide();
            return this;
        };
        dialogBox.prototype.clear = function () {
            this.contents = [];
        };
        dialogBox.prototype.destory = function () {
            this.hide();
            $(this.selector).remove();
        };
        dialogBox.prototype.update = function (content) {
            var $dialogBox = $(this.selector);
            var $body = $dialogBox.find('.modal-body');
            var $title = $dialogBox.find('.modal-title');
            $body.html(content.content);
            $title.html(content.title);
            this.updatePosition();
        };
        dialogBox.prototype.renderTpl = function () {
            return "<div class=\"modal fade\" data-show=\"false\" id=\"" + this.selector.substring(1) + "\">\n                        <div class=\"modal-dialog  modal-" + ModalSize[this.options.size].toLowerCase() + "\">\n                            <div class=\"modal-content\">\n                                <div class=\"modal-header\">\n                                  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n                                  <h4 class=\"modal-title\">" + this.options.title + "</h4>\n                                </div>\n                                <div class=\"modal-body\">" + this.options.content + "</div>\n                            </div>\n                        </div>\n                     </div>";
        };
        dialogBox.prototype.updatePosition = function () {
            var $dialogBox = $(this.selector);
            var wH = $(window).height();
            var H = $dialogBox.find('.modal-dialog').outerHeight(true);
            $dialogBox.find('.modal-dialog').css({ 'transform': "translate(0, " + (wH - H > 0 ? wH - H : 0) / 2 + "px)" });
        };
        return dialogBox;
    }());
    BUI.dialogBox = dialogBox;
    var alertBox = (function (_super) {
        __extends(alertBox, _super);
        function alertBox(options, fn) {
            var _this = this;
            options.selector = options.selector || '#alertBox';
            options.submitTxt = options.submitTxt || 'submit';
            options.submitTxtLoadingTxt = options.submitTxtLoadingTxt || 'loading...';
            _this = _super.call(this, options, fn) || this;
            var $alertBox = $(_this.selector);
            $alertBox.on('click', '.submit', function () {
                if (typeof _this.options.callback === 'function') {
                    _this.options.callback.call(null, _this, $alertBox.find('.submit'));
                }
            });
            return _this;
        }
        alertBox.prototype.renderTpl = function () {
            return "<div class=\"modal fade\" data-show=\"false\" id=\"" + this.selector.substring(1) + "\">\n                        <div class=\"modal-dialog  modal-" + ModalSize[this.options.size].toLowerCase() + "\">\n                            <div class=\"modal-content\">\n                                <div class=\"modal-header\">\n                                  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n                                  <h4 class=\"modal-title\">" + this.options.title + "</h4>\n                                </div>\n                                <div class=\"modal-body\">" + this.options.content + "</div>\n                                <div class=\"modal-footer\">\n                                   <button type=\"button\" class=\"btn btn-primary submit\" data-loading-text=\"" + this.options.submitTxtLoadingTxt + "\">" + this.options.submitTxt + "</button>      \n                                </div>\n                            </div>\n                        </div>\n                     </div>";
        };
        return alertBox;
    }(dialogBox));
    BUI.alertBox = alertBox;
    var confirmBox = (function (_super) {
        __extends(confirmBox, _super);
        function confirmBox(options, fn) {
            var _this = this;
            options.selector = options.selector || '#confirmBox';
            options.cancelTxt = options.cancelTxt || 'cancel';
            _this = _super.call(this, options, fn) || this;
            var $confirmBox = $(_this.selector);
            $confirmBox.off('click').on('click', '.submit, .cancel', function (e) {
                if (typeof _this.options.callback === 'function') {
                    _this.options.callback.call(null, _this, $(e.currentTarget));
                }
            });
            return _this;
        }
        confirmBox.prototype.renderTpl = function () {
            return "<div class=\"modal fade\" data-show=\"false\" id=\"" + this.selector.substring(1) + "\">\n                        <div class=\"modal-dialog  modal-" + ModalSize[this.options.size].toLowerCase() + "\">\n                            <div class=\"modal-content\">\n                                <div class=\"modal-header\">\n                                  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n                                  <h4 class=\"modal-title\">" + this.options.title + "</h4>\n                                </div>\n                                <div class=\"modal-body\">" + this.options.content + "</div>\n                                <div class=\"modal-footer\">\n                                   <button type=\"button\" class=\"btn btn-default cancel\" data-op=\"cancel\">" + this.options.cancelTxt + "</button>   \n                                   <button type=\"button\" class=\"btn btn-primary submit\" data-op=\"submit\"  data-loading-text=\"" + this.options.submitTxtLoadingTxt + "\">" + this.options.submitTxt + "</button> \n                                </div>\n                            </div>\n                        </div>\n                     </div>";
        };
        return confirmBox;
    }(alertBox));
    BUI.confirmBox = confirmBox;
})(BUI || (BUI = {}));
