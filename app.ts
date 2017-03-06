declare var $;
namespace BUI {
    enum ModalSize {
       SM, MD, LG
    }
    interface Option {
        title: string;
        content: string;
        backdrop: boolean;
        vCenter: boolean;
        container: string;
        size: ModalSize;
        selector: string;
    }
    interface modalContent {
        title: string,
        content: string
    }
    export class dialogBox {
        options: Option;
        protected selector: string;
        protected contents: Array<any>;
        fn: Function;
        constructor(options: Option, fn: Function) {
            this.options = <Option>{
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
        render() {
            if ($(this.selector).length) return;
            $(this.options.container).append(this.renderTpl());
            const $dialogBox = $(this.selector);
            $dialogBox.find('.modal-dialog').css('opacity', 0);
            this.updatePosition(); 
            $dialogBox.modal(this.options).on('shown.bs.modal',() => {
                  $dialogBox.find('.modal-dialog').css('opacity', 1);
                  this.updatePosition();
                  if (typeof this.fn === 'function') this.fn();
            });
        }
        show(){
           const $dialogBox = $(this.selector);
           $dialogBox.modal('show');
        }
        hide(){
           const $dialogBox = $(this.selector);
           $dialogBox.modal('hide');
        }
        push(content: modalContent) {
            const $dialogBox = $(this.selector);
            const $body = $dialogBox.find('.modal-body');
            const $title = $dialogBox.find('.modal-title');
            this.contents.push({ title: $title.html(), content: $body.html() });
            this.update(content);
           return this;
        }
        pop(){
           if(this.contents.length) this.update(this.contents.pop());
           else this.hide();
           return this;
        }
        clear(){
          this.contents = [];
        }
        destory(){
          this.hide();
          $(this.selector).remove();
        }
        update(content: modalContent){
           const $dialogBox = $(this.selector);
           const $body = $dialogBox.find('.modal-body');
           const $title = $dialogBox.find('.modal-title');
           $body.html(content.content);
           $title.html(content.title);
           this.updatePosition();
        }
        renderTpl(): string {
            return `<div class="modal fade" data-show="false" id="${this.selector.substring(1)}">
                        <div class="modal-dialog  modal-${ModalSize[this.options.size].toLowerCase()}">
                            <div class="modal-content">
                                <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                  <h4 class="modal-title">${this.options.title}</h4>
                                </div>
                                <div class="modal-body">${this.options.content}</div>
                            </div>
                        </div>
                     </div>`;
        }
        updatePosition(){
             const $dialogBox = $(this.selector);
             var wH = $(window).height();
             var H = $dialogBox.find('.modal-dialog').outerHeight(true);
             $dialogBox.find('.modal-dialog').css({'transform': `translate(0, ${(wH - H > 0 ? wH - H : 0)/2}px)`});
        }
    }
    interface AlertOption extends Option{
        submitTxt: string;
        submitTxtLoadingTxt: string;
        callback: any;
    }
    export class alertBox extends dialogBox{
        options: AlertOption;
        constructor(options: AlertOption, fn){
            options.selector =  options.selector || '#alertBox';
            options.submitTxt = options.submitTxt || 'submit';
            options.submitTxtLoadingTxt = options.submitTxtLoadingTxt || 'loading...';
            super(options, fn);
            var $alertBox = $(this.selector);
            $alertBox.on('click', '.submit', () => {
               if(typeof this.options.callback === 'function'){
                  this.options.callback.call(null, this, $alertBox.find('.submit'));
               }
            })
        }
        renderTpl(){
            return `<div class="modal fade" data-show="false" id="${this.selector.substring(1)}">
                        <div class="modal-dialog  modal-${ModalSize[this.options.size].toLowerCase()}">
                            <div class="modal-content">
                                <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                  <h4 class="modal-title">${this.options.title}</h4>
                                </div>
                                <div class="modal-body">${this.options.content}</div>
                                <div class="modal-footer">
                                   <button type="button" class="btn btn-primary submit" data-loading-text="${this.options.submitTxtLoadingTxt}">${this.options.submitTxt}</button>      
                                </div>
                            </div>
                        </div>
                     </div>`;
        }
    }
    interface ConfirmOption extends AlertOption{
        cancelTxt: string;
    }
    export class confirmBox extends alertBox{
       options: ConfirmOption;
       constructor(options: ConfirmOption, fn){
         options.selector =  options.selector || '#confirmBox';
         options.cancelTxt =  options.cancelTxt || 'cancel';
         super(options, fn);
         var $confirmBox = $(this.selector);
         $confirmBox.off('click').on('click', '.submit, .cancel', (e) => {
            if(typeof this.options.callback === 'function'){
                  this.options.callback.call(null, this, $(e.currentTarget));
            }
         })
       }
       renderTpl(){
            return `<div class="modal fade" data-show="false" id="${this.selector.substring(1)}">
                        <div class="modal-dialog  modal-${ModalSize[this.options.size].toLowerCase()}">
                            <div class="modal-content">
                                <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                  <h4 class="modal-title">${this.options.title}</h4>
                                </div>
                                <div class="modal-body">${this.options.content}</div>
                                <div class="modal-footer">
                                   <button type="button" class="btn btn-default cancel" data-op="cancel">${this.options.cancelTxt}</button>   
                                   <button type="button" class="btn btn-primary submit" data-op="submit"  data-loading-text="${this.options.submitTxtLoadingTxt}">${this.options.submitTxt}</button> 
                                </div>
                            </div>
                        </div>
                     </div>`;
        }
    }

}