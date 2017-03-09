    var idNumber;
    var positionx;
    var positiony;
    var buttonStatus=false;
    var boxNumber=0;

    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({ 
        el: $('#paper-html-elements'), 
        width: 1000, 
        height: 750, 
        gridSize: 1, 
        model: graph 
        });

//---------------------------------------------------------------------------------------------------------
//创建Number的自定义html对象（start）
//---------------------------------------------------------------------------------------------------------

    joint.shapes.html = {};//这一句不要轻易写，会把自定义库的东西完全删除掉的。
//创建一个自定义html空对象（这里是建立的矩形的）
    joint.shapes.html.ElementNumber = joint.shapes.basic.Rect.extend({//建立的矩形
        defaults: joint.util.deepSupplement({
            type: 'html.ElementNumber',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }//建立的矩形，可改为圆形的
            }
        }, joint.shapes.basic.Rect.prototype.defaults)//建立的矩形
    });

// 创建空对象的html布局（注：写好class这些属性，好方便在外面写css）.

    joint.shapes.html.ElementNumberView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="chooseButton">+</button>',
            '<button class="deleteButton" onclick="deleteClick()">x</button>',
            '<button class="inputButton">+</button>',
            '<button class="leftButton">+</button>',
            '<button class="rightButton">+</button>',
            '<span></span>', 
            '<br/>',
            '<label></label>',
            '<input type="text" value="" class="inputBox"/>',
            '<button class="sureButton">确定</button>',
            '<button class="cancelButton">取消</button>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());

//在自定义对象中添加响应事件.

            //点击+按钮，弹出新功能按钮。
            this.$box.find('.chooseButton').on('click', _.bind(function() {
                if(!buttonStatus){
                    this.$box.find('.inputButton').css({
                        display: 'block'
                    });
                    this.$box.find('.deleteButton').css({
                        display: 'block'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'block'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'block'
                    });
                    buttonStatus=true;
                }else{
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    });
                    buttonStatus=false;
                }                        
             }, this));

            // 删除本对象.
            this.$box.find('.deleteButton').on('click', _.bind(this.model.remove, this.model));

            //添加input值相关操作。
            this.$box.find('.inputButton').on('click', _.bind(function() {
                    this.$box.find('.inputBox').css({
                        display: 'block'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'block'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'block'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));   

            //必须要有这句才能把input中的值写到model中，否则无效。
            this.$box.find('input').on('change', _.bind(function(evt) {
                this.model.set('input', $(evt.target).val());
            }, this));

            //将本model的input的值赋值给label。
            this.$box.find('.sureButton').on('click', _.bind(function() {

                this.model.set('label', this.model.get('input'));//把input的值赋值给label

                    this.$box.find('.inputBox').css({
                        display: 'none'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'none'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'none'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
            }, this));   
            
            //input赋值取消。
            this.$box.find('.cancelButton').on('click', _.bind(function() {
                    this.$box.find('.inputBox').css({
                        display: 'none'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'none'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'none'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
            }, this)); 


            //左下侧按钮事件生成新框图并连线。
            this.$box.find('.leftButton').on('click', _.bind(function() {
                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

                var e2 = new joint.shapes.html.ElementNumber({
                    position: { x: positionx-100, y: positiony+100 },
                    size: { width: 100, height: 50 },
                    span: '数值',
                });

                var link1 = new joint.dia.Link({
                    source: { id: idNumber },
                    target: { id: e2.id },
                    attrs: {
                        '.connection': { stroke: '#000000' },
                        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                    },
                });
                graph.addCells([e2,link1]);

                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));

        //右侧按钮事件生成新框图并连线。
        this.$box.find('.rightButton').on('click', _.bind(function() {

                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

            var e2 = new joint.shapes.html.ElementNumber({
                position: { x: positionx+100, y: positiony+100 },
                size: { width: 100, height: 50 },
                span: '数值',
            });

            var link2 = new joint.dia.Link({
                source: { id: idNumber },
                target: { id: e2.id },
                attrs: {
                    '.connection': { stroke: '#000000' },
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                },
             });
             graph.addCells([e2,link2]);

                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));
/*
            //让select被赋予数据。
            this.$box.find('select').val(this.model.get('select'));

            // 这是input存储在单元格模型中的输入数据.
            this.$box.find('label').on('change', _.bind(function(evt) {
                this.model.set('label', $(evt.target).val());
            }, this));
*/
            // 更新的位置改变时，the underlying盒模型.
            this.model.on('change', this.updateBox, this);

            // 当模型从图中移除时删除框.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },

//后端数据转化为视图
        updateBox: function() {
            // 套盒的位置和尺寸，它涵盖了jointjs元.
            var bbox = this.model.getBBox();
            // 数据反馈为图像.
            this.$box.find('span').text(this.model.get('span'));
            this.$box.find('label').text(this.model.get('label'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });
//---------------------------------------------------------------------------------------------------------
//创建Number的HTML对象（start）
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//创建String的自定义html对象（start）
//---------------------------------------------------------------------------------------------------------


//创建一个自定义html空对象（这里是建立的矩形的）
    joint.shapes.html.ElementString = joint.shapes.basic.Rect.extend({//建立的矩形
        defaults: joint.util.deepSupplement({
            type: 'html.ElementString',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }//建立的矩形，可改为圆形的
            }
        }, joint.shapes.basic.Rect.prototype.defaults)//建立的矩形
    });

// 创建空对象的html布局（注：写好class这些属性，好方便在外面写css）.

    joint.shapes.html.ElementStringView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="chooseButton">+</button>',
            '<button class="deleteButton" onclick="deleteClick()">x</button>',
            '<button class="inputButton">+</button>',
            '<button class="leftButton">+</button>',
            '<button class="rightButton">+</button>',
            '<span></span>', 
            '<br/>',
            '<label></label>',
            '<input type="text" value="" class="inputBox"/>',
            '<button class="sureButton">确定</button>',
            '<button class="cancelButton">取消</button>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());

//在自定义对象中添加响应事件.

            //点击+按钮，弹出新功能按钮。
            this.$box.find('.chooseButton').on('click', _.bind(function() {
                if(!buttonStatus){
                    this.$box.find('.inputButton').css({
                        display: 'block'
                    });
                    this.$box.find('.deleteButton').css({
                        display: 'block'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'block'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'block'
                    });
                    buttonStatus=true;
                }else{
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    });
                    buttonStatus=false;
                }                        
             }, this));

            // 删除本对象.
            this.$box.find('.deleteButton').on('click', _.bind(this.model.remove, this.model));

            //添加input值相关操作。
            this.$box.find('.inputButton').on('click', _.bind(function() {
                    this.$box.find('.inputBox').css({
                        display: 'block'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'block'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'block'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));   

            //必须要有这句才能把input中的值写到model中，否则无效。
            this.$box.find('input').on('change', _.bind(function(evt) {
                this.model.set('input', $(evt.target).val());
            }, this));

            //将本model的input的值赋值给label。
            this.$box.find('.sureButton').on('click', _.bind(function() {

                this.model.set('label', this.model.get('input'));//把input的值赋值给label

                    this.$box.find('.inputBox').css({
                        display: 'none'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'none'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'none'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
            }, this));   
            
            //input赋值取消。
            this.$box.find('.cancelButton').on('click', _.bind(function() {
                    this.$box.find('.inputBox').css({
                        display: 'none'
                    });
                    this.$box.find('.sureButton').css({
                        display: 'none'
                    });
                    this.$box.find('.cancelButton').css({
                        display: 'none'
                    });   
                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });
            }, this)); 


            //左下侧按钮事件生成新框图并连线。
            this.$box.find('.leftButton').on('click', _.bind(function() {
                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

                var e2 = new joint.shapes.html.ElementString({
                    position: { x: positionx-100, y: positiony+100 },
                    size: { width: 100, height: 50 },
                    span: '文本',
                });

                var link1 = new joint.dia.Link({
                    source: { id: idNumber },
                    target: { id: e2.id },
                    attrs: {
                        '.connection': { stroke: '#000000' },
                        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                    },
                });
                graph.addCells([e2,link1]);

                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));

        //右侧按钮事件生成新框图并连线。
        this.$box.find('.rightButton').on('click', _.bind(function() {

                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

            var e2 = new joint.shapes.html.ElementString({
                position: { x: positionx+100, y: positiony+100 },
                size: { width: 100, height: 50 },
                span: '文本',
            });

            var link2 = new joint.dia.Link({
                source: { id: idNumber },
                target: { id: e2.id },
                attrs: {
                    '.connection': { stroke: '#000000' },
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                },
             });
             graph.addCells([e2,link2]);

                    this.$box.find('.inputButton').css({
                        display: 'none'
                    });           
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    }); 
            }, this));
/*
            //让select被赋予数据。
            this.$box.find('select').val(this.model.get('select'));

            // 这是input存储在单元格模型中的输入数据.
            this.$box.find('label').on('change', _.bind(function(evt) {
                this.model.set('label', $(evt.target).val());
            }, this));
*/
            // 更新的位置改变时，the underlying盒模型.
            this.model.on('change', this.updateBox, this);

            // 当模型从图中移除时删除框.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },

//后端数据转化为视图
        updateBox: function() {
            // 套盒的位置和尺寸，它涵盖了jointjs元.
            var bbox = this.model.getBBox();
            // 数据反馈为图像.
            this.$box.find('span').text(this.model.get('span'));
            this.$box.find('label').text(this.model.get('label'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });
//---------------------------------------------------------------------------------------------------------
//创建String的HTML对象（start）
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//创建Bool对象（start）
//---------------------------------------------------------------------------------------------------------
    joint.shapes.html.ElementSelect = joint.shapes.basic.Rect.extend({//建立的矩形
        defaults: joint.util.deepSupplement({
            type: 'html.ElementSelect',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }//建立的矩形，可改为圆形的
            }
        }, joint.shapes.basic.Rect.prototype.defaults)//建立的矩形
    });

// 创建该元素显示上面HTML div布局（注：写好class这些属性，好方便在外面写css）.
// -------------------------------------------------------------------------

    joint.shapes.html.ElementSelectView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="chooseButton">+</button>',
            '<button class="deleteButton" onclick="deleteClick()">x</button>',
            '<button class="leftButton">+</button>',
            '<button class="rightButton">+</button>',
            '<span></span>', '<br/>',
            '<select><option>true</option><option>false</option></select>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());

// 对html，div组合图形添加.
// -------------------------------------------------------------------------

            //捕获鼠标所点击的目标,修改其中的css（注：不用id改，用内部的函数来改）。
            this.$box.find('.chooseButton').on('click', _.bind(function() {

                if(!buttonStatus){
                    this.$box.find('.deleteButton').css({
                        display: 'block'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'block'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'block'
                    });
                    buttonStatus=true;
                }else{
                    this.$box.find('.deleteButton').css({
                        display: 'none'
                    });
                    this.$box.find('.leftButton').css({
                        display: 'none'
                    });
                    this.$box.find('.rightButton').css({
                        display: 'none'
                    });
                    buttonStatus=false;
                }
             }, this));
            // 删除选中的框图.
            this.$box.find('.deleteButton').on('click', _.bind(this.model.remove, this.model));
            
            //左侧按钮事件生成新框图并连线。
            this.$box.find('.leftButton').on('click', _.bind(function() {

                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

                var e2 = new joint.shapes.html.ElementSelect({
                    position: { x: positionx-100, y: positiony+100 },
                    size: { width: 100, height: 50 },
                    span: '数值',
                });

                var link1 = new joint.dia.Link({
                    source: { id: idNumber },
                    target: { id: e2.id },
                    attrs: {
                        '.connection': { stroke: '#000000' },
                        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                    },
                });
                graph.addCells([e2,link1]);
            }, this));

        //右侧按钮事件生成新框图并连线。
        this.$box.find('.rightButton').on('click', _.bind(function() {

                idNumber=this.model.id;
                positionx=this.model.get('position').x;
                positiony=this.model.get('position').y;

            var e2 = new joint.shapes.html.ElementSelect({
                position: { x: positionx+100, y: positiony+100 },
                size: { width: 100, height: 50 },
                span: '数值',
            });

            var link2 = new joint.dia.Link({
                source: { id: idNumber },
                target: { id: e2.id },
                attrs: {
                    '.connection': { stroke: '#000000' },
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
                },
             });
             graph.addCells([e2,link2]);
             boxNumber++;
            }, this));

            //让select能够被点击事件触发.
            this.$box.find('select').on('change', _.bind(function(evt) {
                this.model.set('select', $(evt.target).val());
            }, this));

            // 这是select选择数据.
            this.$box.find('select').val(this.model.get('select'));

            // 更新的位置改变时，the underlying盒模型.
            this.model.on('change', this.updateBox, this);

            // 当模型从图中移除时删除框.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {
            // 套盒的位置和尺寸，它涵盖了jointjs元.
            var bbox = this.model.getBBox();
            // 有一个数据存储在细胞模型更新的HTML例子.
            this.$box.find('span').text(this.model.get('span'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });
    
//---------------------------------------------------------------------------------------------------------
////创建Bool对象（end）
//---------------------------------------------------------------------------------------------------------



// 添加拖拽连线的函数事件.
// -------------------------------------------------------------------------
paper.on('cell:pointerup', function(cellView, evt, x, y) {

        // 找到下面的第一个元素不是一个链接，也不是被拖的元素本身.
        var elementBelow = graph.get('cells').find(function(cell) {
            if (cell instanceof joint.dia.Link) return false; // 判断不是链接.
            if (cell.id === cellView.model.id) return false; // 判断不是元素本身.
            if (cell.getBBox().containsPoint(g.point(x, y))) {
                return true;
            }
            return false;
        });

        // 如果两个图形元素之间没有连线，就连接，如果有那就不连接（即无操作）.
        if (elementBelow && !_.contains(graph.getNeighbors(elementBelow), cellView.model)) {

            graph.addCell(new joint.dia.Link({
                source: { id: cellView.model.id }, 
                target: { id: elementBelow.id },
                attrs: { '.marker-source': { d: 'M 10 0 L 0 5 L 10 10 z' } }
            }));
            //移动到下方100px.
            cellView.model.translate(0, 100);
        }
    });

//添加框图按钮触发事件。
//动态生成input组保存数据,写在button点击中，每次生成框图的时候就产生一个input组。
// -----------------------------------------------------------

   function addingInt(){
        var e1 = new joint.shapes.html.ElementNumber({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '数值',
        });
        graph.addCells([e1]);
     };

   function addingString(){
        var e1 = new joint.shapes.html.ElementString({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '文本',
        });
        graph.addCells([e1]);
   };

    function addingBool(){
        var e1 = new joint.shapes.html.ElementSelect({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '布尔',
            select:'',
        });
        graph.addCells([e1]);
   };

    function addingDate(){
        var e1 = new joint.shapes.html.ElementSelect({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '日期',
        });
        graph.addCells([e1]);
   };

    function addingTime(){
        var e1 = new joint.shapes.html.ElementNumber({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '时间',
        });
        graph.addCells([e1]);
   };

    function addingSTP(){
        var e1 = new joint.shapes.html.ElementNumber({
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            span: '时间戳',
        });
        graph.addCells([e1]);
   };

//control选项卡事件
// -----------------------------------------------------------
    var variableButton=document.getElementById("variableButton");
    var parameterButton=document.getElementById("parameterButton");
    var functionButton=document.getElementById("functionButton");
    var constant=document.getElementById("constant");
    var parameter=document.getElementById("parameter");
    var functionContent=document.getElementById("functionContent");

    //first menu
    variableButton.onmousemove=function(){
        constant.style.display="block";
        parameter.style.display="none";
        functionContent.style.display="none";
    };

    variableButton.onmouseout=function(){
        constant.style.display="block";
        parameter.style.display="none";
        functionContent.style.display="none";
    };

    //secend menu
    parameterButton.onmousemove=function(){
        constant.style.display="none";
        parameter.style.display="block";
        functionContent.style.display="none";
    };

    //three menu
    functionButton.onmousemove=function(){
        constant.style.display="none";
        parameter.style.display="none";
        functionContent.style.display="block";
    };


//测试部分代码
//-----------------------------------------------------------

//保存当前数据给后端。
    $("#testSave").click(function(){
        var jsonString = JSON.stringify(graph);//这个变量是string不是json
        //alert(typeof jsonString);
        var data=eval(JSON.parse(jsonString));//对于string的json，先转为json格式，再解析即可
        var dataString=translateData(data);

        $.ajax({
            type:"POST",
            url:"./php/jointSave.php?"+Date.parse(new Date()),
            dataType:"json",
            data:{
                message:jsonString,
                data:dataString
            },
            success:function(data){

            }
        });
    });

//获取后端数据，并转化为界面
    $("#testGet").click(function(){
        $.ajax({
            type:"POST",
            url:"./php/jointGet.php?"+Date.parse(new Date()),
            dataType:"json",
            data:{},
            success:function(data){
                graph.fromJSON(data);
            }
        });
    });

//清空界面视图。
    $("#testclean").click(function(){
        graph.clear(graph);
    });


//转化json为后台格式
function translateData(data){
    var dataString='';
    var array=[];
    for(var i=0;i<data.cells.length;i++){
        if(data.cells[i].type=='link'){
            var souceId=data.cells[i].source.id;
            var targetId=data.cells[i].target.id;
            var targetIdArray=[targetId]
            var arraydata=[souceId,targetIdArray];
            if(array==[]){//第一次添加数组
                array.push(arraydata); 
            }else{
                for(var i=0;i<array.length;i++){//如果存在就替换，如果不存在就添加
                    if(array[i][0]==arraydata[0]){
                        array.splice(i,1,arraydata); 
                    }else{
                        array.push(arraydata); 
                    }
                }    
            }

        }
    }
    return dataString;
}
    