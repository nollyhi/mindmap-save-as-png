<template>
<div class="hello" style="height:auto;">
    <mindmap id="mindmap" v-model="data" :height="500"></mindmap>
    <br/>
    <button class="save btn" @click="save('show')">SHOW CANVAS</button>
    <button class="save btn" @click="save('download')">DOWNLOAD PNG</button>
    <div style="margin:0 0 20px 0;"></div>
</div>
</template>

<script>
import mindmap from '@hellowuxin/mindmap'
export default {
    name: 'HelloWorld',
    components: {
        mindmap,
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            data: [],
            x: 0,
            y: 0,
            scale: 1,
            pngImg: "",
            pngImgWidth: 0,
            pngImgHeight: 0,
        }
    },
    watch: {},
    mounted() {
        this.$nextTick(() => {
            this.initData();
            document.getElementsByClassName('right-bottom')[0].childNodes[2].style.display = "none";
        });
    },
    methods: {
        initData() {
            let dataSource = [{
                "name": "如何学习D3",
                "children": [{
                        "name": "预备知识",
                        "children": [{
                                "name": "HTML & CSS",
                                "children": []
                            },
                            {
                                "name": "JavaScript",
                                "children": []
                            }
                        ]
                    },
                    {
                        "name": "安装",
                        "children": []
                    }
                ]
            }];
            this.data = dataSource;
            document.querySelector('svg').querySelector('g').setAttribute("style", "fill: none; stroke-opacity: 1;stroke-linecap: round;stroke-width: 4px;");
        },
        initStyle(svgEl) {
            var nodeEls = svgEl.getElementsByTagName("foreignObject");
            for (let index = 0; index < nodeEls.length; index++) {
                const element = nodeEls[index];
                const node = nodeEls[index].getBoundingClientRect();
                // const nodeText = nodeEls[index].childNodes[0].getBoundingClientRect()
                const nodeText = nodeEls[index].childNodes[0].offsetWidth;
                element.setAttribute("style", "border-radius: 5px; border-width: 2px; border-color: transparent; border-style: solid; text-align:center;");
                element.childNodes[0].setAttribute("style", "font-size: 13px;color: #4b4b4b; line-height:20px");
            }
            svgEl.childNodes[0].childNodes[0].childNodes.forEach(element => {
                if(element.nodeName === "foreignObject"){
                    element.setAttribute("style", "border-radius: 5px; border-width: 2px; border-color: transparent; border-style: solid; background-color: #fff; text-align:center;")
                }
            });
        },
        svgStatus() {
            var svg = document.querySelector('svg');
            var transform = svg.childNodes[0].getAttribute("transform").split(' ');

            transform.forEach(element => {
                if (element.toLowerCase().indexOf('translate') >= 0) {
                    var startIndex = element.indexOf('(') + 1;
                    var endIndex = element.indexOf(')');
                    var translateValStr = element.substring(startIndex, endIndex).split(',');
                    this.x = Number(translateValStr[0]);
                    this.y = Number(translateValStr[1]);
                }
                if (element.toLowerCase().indexOf('scale') >= 0) {
                    var startIndex = element.indexOf('(') + 1;
                    var endIndex = element.indexOf(')');
                    var scaleValStr = element.substring(startIndex, endIndex);
                    // if()
                    this.scale = Number(scaleValStr);
                }
            });
        },
        // save() {
        //     var cloneTransform = document.getElementsByTagName("svg")[0];
        //     this.initStyle(cloneTransform);
        //     // this.$out.saveSvgAsPng(cloneTransform.querySelector('g') , "diagram.png", {
        //     //     backgroundColor: '#eeeef3',
        //     //     scale: 5,
        //     //     encoderType: "image/png",
        //     //     encoderOptions: 1,
        //     //     width: cloneTransform.querySelector('g').getBoundingClientRect().width+"px",
        //     //     height: cloneTransform.querySelector('g').getBoundingClientRect().height+"px",
        //     // });
        //     debugger
        //     this.$out.svgAsDataUri(cloneTransform, {
        //         backgroundColor: '#eeeef3',
        //         encoderType: "image/png",
        //         encoderOptions: 0,
        //         width: cloneTransform.querySelector('g').getBoundingClientRect().width,
        //         height: cloneTransform.querySelector('g').getBoundingClientRect().height,
        //         top:0
        //     }).then(uri => {
        //         console.log(uri);
        //         this.pngImgWidth= cloneTransform.querySelector('g').getBoundingClientRect().width;
        //         this.pngImgHeight= cloneTransform.querySelector('g').getBoundingClientRect().height;
        //         document.getElementById('img').setAttribute("style","width: "+this.pngImgWidth+"px; height: "+this.pngImgHeight+"px;")
        //         this.pngImg = uri;
        //     });
        // },
        save(type) {
            document.getElementsByClassName('right-bottom')[0].childNodes[0].click();
            setTimeout(() => {
                document.getElementsByClassName('right-bottom')[0].childNodes[1].click();
                setTimeout(() => {
                    this.readyCanvas(type);
                }, 500);
            }, 300);
        },
        readyCanvas(type) {
            var _self = this;
            _self.svgStatus();
            var serializer = new XMLSerializer();
            var svg1 = document.querySelector('svg');
            var toExport = svg1.cloneNode(true);
            var bb = svg1.getBBox();
            // debugger
            _self.y = svg1.clientHeight > bb.height ? (_self.y-(svg1.clientHeight - bb.height)/2) : _self.y;
            var mmWidth = bb.width / _self.scale;
            var mmHeight = bb.height / _self.scale
            var saveScale = 3;
            var transX = 24*3/2;
            var transY = _self.scale >= saveScale ? (_self.y/(_self.scale/saveScale)):(_self.y*(saveScale/_self.scale));
            toExport.childNodes[0].setAttribute("transform", "translate(" + transX + "," + (transY) + ") scale(" + saveScale + ")"); 
            this.initStyle(toExport);
            toExport.setAttribute('viewBox', 0 + ' ' + 0 + ' ' + mmWidth * saveScale + ' ' + mmHeight * saveScale);
            toExport.setAttribute('width', mmWidth * saveScale);
            toExport.setAttribute('height', mmHeight * saveScale);
            var source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(toExport);
            var image = new Image;
            image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            var canvas = document.createElement("canvas");
            canvas.width = mmWidth * saveScale;
            canvas.height = mmHeight * saveScale;
            var context = canvas.getContext("2d");
            context.fillStyle = '#eeeef3'; //#fff设置保存后的PNG 是白色的  
            context.fillRect(0, 0, mmWidth * saveScale, mmHeight * saveScale);
            image.onload = function () {
                context.drawImage(image, 0, 0);
                context.save();
                var gradient=context.createLinearGradient(0,0,210,30);
                gradient.addColorStop("0","green");
                gradient.addColorStop("0.5","blue");
                gradient.addColorStop("1.0","red");
                context.fillStyle = gradient;
                context.globalAlpha  = .7;
                context.font = "18px Avenir,Helvetica,Arial,sans-serif";
                context.fillText(type === "download"?'Saved By Nolly':"Previewed By Nolly",10,25);
                // context.fillText("@hellowuxin",10,50);
                if(type === "download"){
                    var a = document.createElement("a");
                    a.download = "mindmap.png";
                    a.href = canvas.toDataURL("image/png");
                    a.click();
                }
            }
            if(type === "show"){
                document.getElementsByTagName("canvas")[0]?document.body.removeChild(document.getElementsByTagName('canvas')[0]):false;
                document.body.appendChild(canvas);
            }
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
