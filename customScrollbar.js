(function(window){
	var scrollbar = function(data){
		return new Customscrollbar(data).init();
	};
	var Customscrollbar = function(data){
		this.scrollbarBox = document.querySelector('#'+data.scrollbarBoxId);
		this.scrollbarContent = document.querySelector('#'+data.scrollbarContentId);
		this.scrollbarY = document.querySelector('#'+data.scrollbarYId);
		this.scrollbarX = document.querySelector('#'+data.scrollbarXId);
		this.data = data;
		this.scrollbarContentHeight = 0;
		this.scrollbarContentWidth = 0;
		this.scrollbarBoxHeight = 0;
		this.scrollbarBoxWidth = 0;
		this.scrollbarYHeight = 0;
		this.scrollbarXWidth = 0;
		this.scrollbarYTop = 0;
		this.scrollbarXLeft = 0;
		this.downPageY = '';
		this.downPageX = '';
		this.movePageY = '';
		this.movePageX = '';
		this.changePageY = '';
		this.changePageX = '';
		this.is_mouse_down_Y = false;
		this.is_mouse_down_X = false;
	};
	Customscrollbar.prototype = {
		init : function(){
			this.dom();
			this.css();
			this.listener();
		},
		dom: function(){
		
			if(this.data.scrollbarBoxId&&this.data.scrollbarContentId){
				this.scrollbarBox = document.querySelector('#'+this.data.scrollbarBoxId);
				this.scrollbarContent = document.querySelector('#'+this.data.scrollbarContentId);
			}else{
				this.scrollbarBox = document.querySelector('#scrollbar-box');
				this.scrollbarContent = document.querySelector('#scrollbar-content');
			};
			
			if(this.data.scrollbarYId){
				this.scrollbarY = document.createElement('div');
				this.scrollbarY.setAttribute('id', this.data.scrollbarYId);
				this.scrollbarBox.insertAdjacentElement("afterend", this.scrollbarY);
			}else{
				this.scrollbarY = document.createElement('div');
				this.scrollbarY.setAttribute('id', 'scrollbarY');
				this.scrollbarBox.insertAdjacentElement("afterend", this.scrollbarY);
			}
			
		},
		css : function(){
			
			if(this.scrollbarBox.style.position != 'relative'&&this.scrollbarBox.style.position != 'absolute'){
				this.scrollbarBox.style.position = 'relative';
			};
			
			this.scrollbarBox.style.overflow = 'scroll';
			
			this.scrollbarBoxHeight = this.scrollbarBox.offsetHeight;
			this.scrollbarBoxWidth = this.scrollbarBox.offsetWidth;
			this.scrollbarContentHeight = this.scrollbarContent.scrollHeight;
			this.scrollbarContentWidth = this.scrollbarContent.scrollWidth;
			
			if(this.scrollbarContentHeight>this.scrollbarBoxHeight){
				this.scrollbarYHeight = this.scrollbarBoxHeight*this.scrollbarBoxHeight / this.scrollbarContentHeight;
				this.scrollbarY.style.height = this.scrollbarYHeight + 'px';
			}else{
				this.scrollbarY.style.height = 0;
			}
			
			if(this.data.scrollbarYWidth){
				this.scrollbarY.style.width = this.data.scrollbarYWidth + 'px';
			}else{
				this.scrollbarY.style.width = '8px';
			};
			
			this.scrollbarY.style.position = 'absolute';
			
			if(this.scrollbarYTop){
				this.scrollbarY.style.top = this.scrollbarYTop;
			}else{
				this.scrollbarY.style.top = 0;
			};
			this.scrollbarY.style.right = 0;
			
			if(this.data.scrollbarYColor){
				this.scrollbarY.style.background = this.data.scrollbarYColor;
			}else{
				this.scrollbarY.style.background = '#cccccc';
			};
			
			if(this.data.scrollbarYRadius){
				this.scrollbarY.style.borderRadius = this.data.scrollbarYRadius + 'px';
			}else{
				this.scrollbarY.style.borderRadius = 0;
			};
			this.scrollbarY.style.display = 'none';
			
		},
		listener: function(){
			this.scrollbarBox.addEventListener('mouseover', this.onMouseOver.bind(this), false);
			this.scrollbarBox.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
			this.scrollbarBox.addEventListener('scroll', this.onScrollMethod.bind(this), false);
			this.scrollbarY.addEventListener('mouseover', this.onMouseOver.bind(this), false);
			this.scrollbarY.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
			this.scrollbarY.addEventListener('scroll', this.onScrollMethod.bind(this), false);
			this.scrollbarY.addEventListener('mousedown', this.onMouseDownY.bind(this), false);
			document.documentElement.addEventListener('mouseup', this.documentMouseUp.bind(this), false);
			document.documentElement.addEventListener('click', this.documentClick.bind(this), false);
			document.documentElement.addEventListener('mousemove', this.documentMouseMove.bind(this), false);
			
		},
		documentMouseUp: function(){
			console.log('documentMouseUp');
			this.scrollbarY.style.display = 'none';
			if(this.is_mouse_down_Y){
				this.is_mouse_down_Y = false;
			};
		},
		documentClick: function(){
			if(this.is_mouse_down_Y){
				this.is_mouse_down_Y = false;
			}
		},
		documentMouseMove: function(e){
			if(this.is_mouse_down_Y){
				this.moreValueY = this.scrollbarContentHeight - this.scrollbarBoxHeight;
				this.lessValueY = this.scrollbarBoxHeight - this.scrollbarYHeight;
				this.scrollbarY.style.display = 'block';
				this.movePageY = e.pageY;
				this.changePageY = this.movePageY - this.downPageY;
				this.downPageY = this.movePageY;
				if (this.scrollbarY.offsetTop + this.changePageY >= parseInt(this.lessValueY)) {
					this.scrollbarYTop = this.lessValueY + 'px';
					this.scrollbarY.style.top = this.scrollbarYTop;
					this.scrollbarBox.scrollTop = this.moreValueY;
					this.resetCss();
					return;
				}
				this.scrollbarYTop = (this.scrollbarY.offsetTop + this.changePageY) + 'px';
				this.scrollbarY.style.top = this.scrollbarYTop;
				var changeValue = parseFloat(this.scrollbarYTop.replace(/px/g, ""))/this.lessValueY*this.moreValueY;
				this.scrollbarBox.scrollTop = changeValue;
				this.resetCss();
			}
		},
		onMouseDownY: function(e){
			e.preventDefault();
			console.log('active on mousedown Y',e);
			this.is_mouse_down_Y = true;
			this.downPageY = e.clientY;
		},
		onMouseOver: function(e){
			this.resetDivCss();
		},
		onMouseLeave: function(){
			if(!this.is_mouse_down_Y){
				this.scrollbarY.style.display = 'none';
			}
		},
		onScrollMethod: function(e){
			this.resetDivCss();
			if(this.scrollbarContentHeight > this.scrollbarBoxHeight){
				this.scrollbarY.style.display = 'block';
				this.moreValueY = this.scrollbarContentHeight - this.scrollbarBoxHeight;
				this.lessValueY = this.scrollbarBoxHeight - this.scrollbarYHeight;
				this.scrollbarYTop = this.scrollbarBox.scrollTop/this.moreValueY*this.lessValueY + 'px';
				this.scrollbarY.style.top = this.scrollbarYTop;
			}
		
		},
		resetDivCss: function(){
			this.scrollbarContentHeight = this.scrollbarContent.scrollHeight;
			this.scrollbarContentWidth = this.scrollbarContent.scrollWidth;
			this.scrollbarBoxHeight = this.scrollbarBox.offsetHeight;
			this.scrollbarBoxWidth = this.scrollbarBox.offsetWidth;
			if(this.scrollbarContentHeight>this.scrollbarBoxHeight){
				this.scrollbarYHeight = this.scrollbarBoxHeight*this.scrollbarBoxHeight/this.scrollbarContentHeight;
				this.scrollbarY.style.height = this.scrollbarYHeight + 'px';
				this.moreValueY = this.scrollbarContentHeight - this.scrollbarBoxHeight;
				this.lessValueY = this.scrollbarBoxHeight - this.scrollbarYHeight;
				this.scrollbarYTop = this.scrollbarBox.scrollTop/this.moreValueY*this.lessValueY + 'px';
				this.scrollbarY.style.top = this.scrollbarYTop;
				this.scrollbarY.style.display = 'block';
			}else{
				this.scrollbarY.style.height = 0;
				this.scrollbarY.style.top = 0;
			}
			
		},
		resetCss: function(){
			if(this.scrollbarY.offsetTop<0){
				this.scrollbarYTop = 0;
				this.scrollbarY.style.top = this.scrollbarYTop + 'px';
			};
			if(this.scrollbarY.offsetTop>this.lessValueY){
				this.scrollbarYTop = this.lessValueY;
				this.scrollbarY.style.top = this.scrollbarYTop + 'px';
			};
		
		}
	};
	window.scrollbar = scrollbar;
})(window);
