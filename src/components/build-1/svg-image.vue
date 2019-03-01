<template>
  <div class="svgComponentContainer">
    <svg
      ref="svgWrap"
      class="svgComponentContainer__wrap"
      :width="width"
      :height="height"
      :viewBox="viewBox"
      :style="styleSvgViewBox"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <image :xlink:href="image" width="100%" height="100%" x="0" y="0"/>

      <g class="group" v-for="(item, index) in points" :key="index">

        <circle
          v-show="index == svgElementIsZoomIndex"
          :style  ="styleLineStroke"
          :cx     ="svgElementIsZoomFakeElement.x"
          :cy     ="svgElementIsZoomFakeElement.y"
          :r      ="svgElementIsZoomFakeElement.radius"
          class="group__circle_fake"
        ></circle>

        <circle
          v-show="index != svgElementIsZoomIndex"
          @mousedown="startDragElement"
          :style="styleLineStroke"
          :data-id  ="index"
          :cx       ="item.x"
          :cy       ="item.y"
          :r        ="item.radius"
          class="group__circle"
        ></circle>

        <circle
          v-show="index != svgElementIsZoomIndex"
          :ref="'c' + index"
          :cx="item.x - item.radius"
          :cy="item.y"
          :r="style.circleTextRadius"
          class="group__circleNumber"
        ></circle>
        <text
          v-show="index != svgElementIsZoomIndex"
          :ref="'t' + index"
          :x="item.x - item.radius"
          :y="item.y"
          style="fill:white"
          text-anchor="middle"
          dy="0.4em"
          :font-size="style.fontSize"
        >
          {{ index }}
        </text>

        <!--radius change-->
        <circle
          v-show="index != svgElementIsZoomIndex && resizable"
          :data-zoomId="index"
          :cx="item.x + item.radius"
          :cy="item.y"
          :r="style.circleZoomRadius"
          class="group__circleNumber"
          @mousedown="startDragElement"
        ></circle>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "svgComponentContainer",
    props: {

      //Флаг обнуления zoom и перемещения
      reset: { type: Boolean, default: false },

      width : {
        type: Number,
        default: 800
      },
      height : {
        type: Number,
        default: 800
      },
      viewBox : {
        type: String,
        default: '0 0 800 800'
      },
      image: {
        type: String,
        // default: ''
        default: ''
        // default: 'https://www.chitalnya.ru/upload2/585/5587061373516917.gif'
      },
      points: {
        type: Array,
        default: () => {
          return []
        }
      },
      draggable : {
        type: Boolean,
        default: true
      },
      resizable : {
        type: Boolean,
        default: true
      },
      zoomStep : {
        type: Number,
        default: 0.1
      },
    },
    data() {
      return {

        svgViewBoxTransform : { x: 0, y: 0, z: 1 },
        svgViewBoxMove: false,
        svgViewBoxMove_x: 0,
        svgViewBoxMove_y: 0,

        svgElement: null,

        svgElementIsZoom: false,
        svgElementIsZoomIndex: null,
        svgElementIsZoomFakeElement: { x:0, y:0, radius:0 },
        svgElementIsZoomIndex_x: 0,
        svgElementIsZoomIndex_currentX: 0,

        svgElementMove: false,
        svgElementMoveIndex: null,
        svgElementMoveIndex_x: 0,
        svgElementMoveIndex_y: 0,
        svgElementMoveIndex_currentX: 0,
        svgElementMoveIndex_currentY: 0,

        style:{
          circleZoomRadius_default: 5,
          circleZoomRadius_step: 0.5,
          circleZoomRadius: 5,
          circleTextRadius_default: 15,
          circleTextRadius_step: 1,
          circleTextRadius: 15,
          fontSize_default: 13,
          fontSize_step: 1,
          fontSize: 13,
          lineStroke_default: 2,
          lineStroke_step: 0.2,
          lineStroke: 2
        }

      };
    },
    watch: {
      "svgViewBoxTransform.z" : function(zoom){
        this.$set(this.style,"circleZoomRadius",
          zoom > 8 ? 1 : this.style.circleZoomRadius_default - zoom*this.style.circleZoomRadius_step
        )
        this.$set(this.style,"lineStroke",
          zoom > 8 ? 0.4 : this.style.lineStroke_default - zoom*this.style.lineStroke_step
        )
        this.$set(this.style,"circleTextRadius",
          zoom > 8 ? 7 : this.style.circleTextRadius_default - zoom*this.style.circleTextRadius_step
        )
        this.$set(this.style,"fontSize",
          zoom > 8 ? 5 : this.style.fontSize_default - zoom*this.style.fontSize_step
        )
      },
      "reset": function(reset){
        this.svgViewBoxTransform = { x: 0, y: 0, z: 1 }
        this.$emit('update:reset', false)
      }
    },
    methods: {

      onMouseEnter: function(){
        this.$refs.svgWrap.addEventListener('wheel', this.onMouseWheels)
        this.$refs.svgWrap.addEventListener("mousedown", this.onMouseDown)
        this.$refs.svgWrap.addEventListener("mousemove", this.onMouseMove);
        this.$refs.svgWrap.addEventListener('mouseup', this.onMouseUp)
      },

      onMouseLeave: function(){
        this.onMouseUp()
        this.endDragElement()
        this.$refs.svgWrap.removeEventListener('wheel', this.onMouseWheels)
        this.$refs.svgWrap.removeEventListener("mousedown", this.onMouseDown)
        this.$refs.svgWrap.removeEventListener("mousemove", this.onMouseMove);
        this.$refs.svgWrap.removeEventListener('mouseup', this.onMouseUp);
      },

      onMouseWheels: function (e) {
        var
          step = e.deltaY > 0 ? -this.zoomStep : this.zoomStep,
          zoom_current = this.svgViewBoxTransform.z,
          zoom_new = zoom_current + step,
          isNotFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') == -1,
          offsetX = isNotFirefox ? e.offsetX : e.layerX,
          offsetY = isNotFirefox ? e.offsetY : e.layerY;

        if (zoom_new < 0.1){
          this.$set(this.svgViewBoxTransform, 'z', 0.1)
          return false
        }

        this.$set(
          this.svgViewBoxTransform,
          'x',
          (offsetX * zoom_new - offsetX * zoom_current) + this.svgViewBoxTransform.x
        )
        this.$set(
          this.svgViewBoxTransform,
          'y',
          (offsetY * zoom_current - offsetY * zoom_new) + this.svgViewBoxTransform.y
        )
        this.$set(
          this.svgViewBoxTransform,
          'z',
          zoom_new)
      },

      onMouseDown: function(e){
        if (!this.svgElementMove){
          e.preventDefault();
          this.svgViewBoxMove = true
          this.svgViewBoxMove_x = e.clientX
          this.svgViewBoxMove_y = e.clientY
        }
      },

      onMouseUp: function(){
        if (!this.svgElementMove) {
          this.svgViewBoxMove = false
        }
      },

      onMouseMove: function(e){
        if (!this.svgElementMove) {
          e.preventDefault();
          if (this.svgViewBoxMove) {
            this.$set(
              this.svgViewBoxTransform,
              "x",
              this.svgViewBoxTransform.x + this.svgViewBoxMove_x - e.clientX
            )
            this.$set(
              this.svgViewBoxTransform,
              "y",
              this.svgViewBoxTransform.y + e.clientY - this.svgViewBoxMove_y
            )
            this.svgViewBoxMove_x = e.clientX;
            this.svgViewBoxMove_y = e.clientY;
          }
        }
      },

      startDragElement: function(e) {

        e.preventDefault();

        if (!this.draggable)
          return false

        this.svgElementMove = true
        this.svgElement = e.target

        if (this.svgElement.getAttribute('data-zoomId'))
          this.svgElementIsZoom = true

        if (this.svgElementIsZoom) {
          this.svgElementIsZoomIndex = this.svgElement.getAttribute('data-zoomId');
          this.$set(this.svgElementIsZoomFakeElement, "x", this.points[this.svgElementIsZoomIndex].x);
          this.$set(this.svgElementIsZoomFakeElement, "y", this.points[this.svgElementIsZoomIndex].y);
          this.$set(this.svgElementIsZoomFakeElement, "radius", this.points[this.svgElementIsZoomIndex].radius);
          this.svgElementIsZoomIndex_x = e.clientX
          this.svgElementIsZoomIndex_currentX = this.points[this.svgElementIsZoomIndex].radius
        } else {
          this.svgElementMoveIndex = this.svgElement.getAttribute('data-id');
          this.svgElementMoveIndex_x = e.clientX
          this.svgElementMoveIndex_y = e.clientY
          this.svgElementMoveIndex_currentX = this.points[this.svgElementMoveIndex].x
          this.svgElementMoveIndex_currentY = this.points[this.svgElementMoveIndex].y
        }

        this.$refs.svgWrap.addEventListener("mousemove", this.dragElement);
        this.$refs.svgWrap.addEventListener("mouseup", this.endDragElement);
      },

      dragElement: function(e) {
        e.preventDefault();
        if (this.svgElementIsZoom) {
          var x = e.clientX - this.svgElementIsZoomIndex_x
          var newR = this.svgElementIsZoomIndex_currentX + ( x / this.svgViewBoxTransform.z )
          if (newR < 20) newR = 20
          this.$set(this.svgElementIsZoomFakeElement, "radius", newR );
        } else {
          var x = e.clientX - this.svgElementMoveIndex_x
          var y = e.clientY - this.svgElementMoveIndex_y
          this.$set( this.points[this.svgElementMoveIndex], "x", this.svgElementMoveIndex_currentX + ( x / this.svgViewBoxTransform.z ) )
          this.$set( this.points[this.svgElementMoveIndex], "y", this.svgElementMoveIndex_currentY + ( y / this.svgViewBoxTransform.z ) )
        }
      },

      endDragElement: function() {
        this.svgElementMove = false

        this.$refs.svgWrap.removeEventListener("mousemove", this.dragElement);
        this.$refs.svgWrap.removeEventListener("mouseup", this.endDragElement);

        if (this.svgElementIsZoom) {
          this.$set(this.points[this.svgElementIsZoomIndex], "radius", Number((this.svgElementIsZoomFakeElement.radius).toFixed(0)) );
        }


        //emit
        if (this.svgElementMoveIndex){
          // console.log('svgElementMoveIndex', this.svgElementMoveIndex)
          this.$emit('has-changed', this.svgElementMoveIndex)
        } else if (this.svgElementIsZoomIndex){
          // console.log('svgElementIsZoomIndex', this.svgElementIsZoomIndex)
          this.$emit('has-changed', this.svgElementIsZoomIndex)
        }

        this.zeroingData()
      },

      zeroingData: function() {
        this.svgElement = null

        this.svgElementIsZoom= false
        this.svgElementIsZoomIndex= null
        this.svgElementIsZoomFakeElement= { x:0, y:0, radius:0 }
        this.svgElementIsZoomIndex_x= 0
        this.svgElementIsZoomIndex_currentX= 0

        this.svgElementMove= false
        this.svgElementMoveIndex= null
        this.svgElementMoveIndex_x= 0
        this.svgElementMoveIndex_y= 0
        this.svgElementMoveIndex_currentX= 0
        this.svgElementMoveIndex_currentY= 0
      }

    },
    computed: {

      styleSvgViewBox() {
        return {
          transform: 'translate3d( ' + -this.svgViewBoxTransform.x + 'px, ' + this.svgViewBoxTransform.y + 'px, 0px) scale('+this.svgViewBoxTransform.z+')'
        }
      },
      styleLineStroke: function(){
        return {
          strokeWidth: this.style.lineStroke

        }
      }
    }
  };
</script>

<style lang="scss" scoped>

  .svgComponentContainer{
    border: 1px dashed #eee;
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    margin: auto;
    overflow: hidden;
    &__wrap{
      position: absolute;
      top:0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      transform-origin: 0 0 0;
      transform: translate(0,0) scale(1);
    }
  }

  .group {
    &__circle {
      stroke: #f00;
      stroke-linecap: round;
      fill-opacity: 0.3;
      fill: #fff;
      -webkit-transition: fill-opacity 0.2s ease;
      -moz-transition: fill-opacity 0.2s ease;
      transition: fill-opacity 0.2s ease;
      &:hover {
        fill-opacity: 0.7;
      }
      &_fake {
        stroke-width: 2;
        fill-opacity: 0.5;
        stroke: #f00;
        fill: #fff;
      }
    }
    &__circleNumber {
      fill: #f00;
      color: #ffffff;
    }
  }



</style>

