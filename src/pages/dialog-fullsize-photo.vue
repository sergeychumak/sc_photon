<template>

  <div class="vApplication">

    <div class="vApplication__page">

      <div class="app" style=" background: #fff">
        <v-btn icon large @click="$emit('close-dialog')" style="z-index: 11">
          <v-icon large>close</v-icon>
        </v-btn>
        <div class="slider__item slider__item_active">
          <div class="scalable-preview scalable-preview_active slider__preview"

          >

            <img

              id="my-image"
              @mousedown="startDrag" @mousemove="doDrag"
              :src="get_url_image(photoId)"
              class="scalable-preview__image"

              :style="style"
            />

          </div>
        </div>

        <!--v-bind:style="{ transition: transitionCss }"-->

      </div>

    </div>

  </div>

</template>

<script>
  export default {
    name: 'FullSizePhoto',
    props:["photoId","dialog_originalImage"],
    watch: {
      'dialog_originalImage': function (newValue) {
        if (newValue) {
          this.isX = 0
          this.isY = 0
          this.isZ = 1
        }
      }
    },
    data: function(){
      return {
        dragging: false,
        x: 'no',
        y: 'no',

        isX:0,
        isY:0,
        isZ:1
      }
    },
    mounted() {
      window.addEventListener('mousedown', this.MD);
      document.addEventListener('wheel', this.MW);
      window.addEventListener('mouseup', this.stopDrag);
      document.getElementById('my-image').ondragstart = function() { return false; };
    },
    methods:{
      MW: function(event){
        if (event.deltaY > 0 ){
          this.isZ = this.isZ + 0.1
        }else{
          this.isZ = this.isZ - 0.1
        }


      },
      MD: function(event){
        this.x = event.clientX;
        this.y = event.clientY;
      },
      startDrag() {
        this.dragging = true;
        this.x = this.y = 0;
      },
      stopDrag() {
        this.dragging = false;
        this.x = this.y = 'no';
      },
      doDrag(event) {
        if (this.dragging) {

          this.isX = this.isX + this.x - event.clientX
          this.isY =  this.isY + event.clientY - this.y

          this.x = event.clientX;
          this.y = event.clientY;
        }
      },
      get_url_image: function (id) {
        console.log('dialog-full')
        if (id)
          return "api/photoFile/photoFile/" + id
        else
          return ""
      }
    },
    computed: {
      style () {
        return {
          transition: 'all 0s ease 0s',
          transform: 'translate3d( ' + -this.isX + 'px, ' + this.isY + 'px, 0px) scale(' + this.isZ + ')'
        }
      }
    }
  }


</script>

<style>
  .slider__item_active {
    opacity: 1;
    z-index: 1;
  }
  .slider__item {
    text-align: center;
  }
  .slider__item, .slider__items {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .scalable-preview {
    position: relative;
    max-width: 100%;
    height: 100%;
  }

  .scalable-preview__image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

</style>

