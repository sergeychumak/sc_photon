<template>
  <v-layout column style="border-top: 1px solid #e0e0e0">

    <v-flex shrink class="overflowAuto pa-2 ma-0" style="background: #eee;min-height:270px; max-height:270px;">
      <v-layout row class="pa-0 ma-0">
        <v-flex shrink v-for="(item,index) in perspective.view" ref="dropTargets" :key="'drop_'+item.perspectiveViewName">
          <v-card class="pa-0 mr-2" width="230" height="230">

            <v-layout fill-height column class="pa-2 ma-0">
              <v-flex shrink class="caption">
                <span class="font-weight-bold">{{item.perspectiveViewName}}</span>
              </v-flex>
            <v-flex
              :style="{
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundImage: 'url(' + getUrlImageByItem(item) + ')',
                border: '1px dashed #ddd'
              }"
            >
            </v-flex>
            <v-flex shrink class="mt-1">
              <v-btn
                @click="deletePhotoPerspective(index)"
                class="ma-0 pa-0 ml-1" flat small icon color="blue"><v-icon small>delete</v-icon></v-btn>
            </v-flex>
          </v-layout>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>


    <v-flex shrink class="overflowAuto pa-2 pt-4" style="background: #fff;  "  ref="isBlock" >

      <!-- NAME -->
      <div ref="isHook__Name" class="blue--text">
        / Настройка ракурсов <span v-if="perspectiveGroup !== ''" class="black--text"> для группы {{perspectiveGroup}}</span>
      </div>

      <!-- ACTION -->
      <div ref="isHook__Actions">
        <v-btn small icon @click="back"><v-icon>close</v-icon></v-btn>
      </div>


      <v-layout row class="pa-0 ma-0" >


        <v-flex shrink v-for="(item,index) in perspective.suggestion" :key="'drag_' + item.originalFileName">
          <v-card class="pa-0 mr-2" width="230" height="230" @mousedown="mousedown(index,$event)">

            <v-layout fill-height column class="pa-2 ma-0">
              <v-flex
                :style="{
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundImage: 'url(' + getUrlImage(item.photoFileCodePreview) + ')',
                border: '1px dashed #ddd'
              }"
              >
              </v-flex>
            </v-layout>

          </v-card>
        </v-flex>

      </v-layout>

    </v-flex>
    <v-flex></v-flex>

  </v-layout>

</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'perspective',
    data: function(){
      return {
        perspectiveGroup: "",
        perspective: {
          view: [],
          chosen: [],
          suggestion: []
        },

        dragObject: null,
        mouseOffset: null,

        indexDrag: 0,
        indexDrop: 0

      }
    },
    mounted: function(){
      this.getData()
    },
    methods:{

      ...mapActions("main", {
        POST_REQUEST: "postRequest",
        GET_REQUEST: "getRequest"
      }),

      getData: function(){
        var chosen = []
        var view = []
        this.GET_REQUEST({url: "perspective.chosen", appData: "/" + this.$route.params.id})
        .then(res=>{
          chosen = res.data
          this.GET_REQUEST({url: "perspective.view", appData: "/" + this.$route.params.id})
            .then(res=>{
              view = res.data
              chosen.map(elChosen=>{
                view.map(elPerspective=>{
                  if (elChosen.shootingOrderForeignCode === elPerspective.shootingOrderForeignCode){
                    elPerspective['item'] = elChosen
                  }
                })
              })
              this.perspective.chosen = chosen
              this.perspective.view = view
              if ( this.perspective.view.length > 0 ){
                this.perspectiveGroup = this.perspective.view[0].perspectiveGroupName
              }
            })
        })
        this.GET_REQUEST({url: "perspective.suggestion", appData: "/" + this.$route.params.id})
          .then(res=>{
            this.perspective.suggestion = res.data
          })
      },

      back: function(){
        if (window.history.state === null){
          this.$router.push({name:"card-list"})
        }else{
          this.$router.go(-1)
        }
      },

      getUrlImageByItem: function (item) {
        if (item['item']){
          return this.getUrlImage(item['item'].photoFileCodePreview)
        }
        return ""
      },
      getUrlImage: function (id) {
        return "api/photoFile/photoFile/" + id
      },

      preSave: function(){
        var res = this.perspective.view
        res[this.indexDrop]['item'] = this.perspective.suggestion[this.indexDrag]
        this.save(res)
      },
      save: function(view = this.perspective.view){

        var perspectiveMappingList = []
        view.map(el=>{
          if(el['item']){
            perspectiveMappingList.push({
              "perspectiveViewCode": el.perspectiveViewCode,
              "photoFileCode": el['item'].photoFileCode,
              "shootingOrderForeignCode": el.shootingOrderForeignCode
            })
          }
        })

        this.POST_REQUEST({
          url: "perspective.save",
          data: {
            "accountUserCode": 0,
            "wareCardCode": this.$route.params.id,
            "perspectiveMappingList": perspectiveMappingList
          }
        })
        .then(()=>{
          this.getData()
        })
      },

      deletePhotoPerspective(index){
        var res = this.perspective.view.filter((el, i) => {
          if (i !== index)
            return true
        })
        this.save(res)
      },

      mousedown: function(index, e){
        e = this.fixEvent(e)
        if (e.which!=1) return
        this.dragObject = e.target
        this.mouseOffset = this.getMouseOffset(e.target, e)
        this.indexDrag = index
        document.onmousemove = this.mouseMove
        document.onmouseup = this.mouseUp
      },
      mouseMove: function(e){

        var fixLeft = this.$refs.isBlock.scrollLeft
        var fixTop = this.$refs.isBlock.scrollTop

        e = this.fixEvent(e)
        this.dragObject.style.position = 'fixed'
        this.dragObject.style.top = e.pageY - this.mouseOffset.y  - fixTop + 'px'
        this.dragObject.style.left = e.pageX - this.mouseOffset.x  - fixLeft +  'px'
        this.dragObject.style.width = '210px'
        this.dragObject.style.height = '210px'
        this.dragObject.style.backgroundColor = '#FFF'
        this.dragObject.style.border = '1px solid #555'
        return false
      },
      mouseUp: function(e){
        e = this.fixEvent(e)
        for(var i=0; i<this.$refs.dropTargets.length; i++){
          var targ  = this.$refs.dropTargets[i]
          var targPos    = this.getPosition(targ)
          var targWidth  = parseInt(targ.offsetWidth)
          var targHeight = parseInt(targ.offsetHeight)

          if(
            (e.pageX > targPos.x)                &&
            (e.pageX < (targPos.x + targWidth))  &&
            (e.pageY > targPos.y)                &&
            (e.pageY < (targPos.y + targHeight)))
          {
            this.indexDrop = i
            this.preSave()
          }else{
            this.dragObject.style.position = ''
            this.dragObject.style.top = '0px'
            this.dragObject.style.left = '0px'
            this.dragObject.style.width = 'initial'
            this.dragObject.style.height = 'initial'
            this.dragObject.style.backgroundColor = ''
            this.dragObject.style.border = '1px dashed #ddd'
            this.getData()
          }


        }

        this.dragObject = null
        document.onmousemove = null
        document.onmouseup = null
        document.ondragstart = null
        document.body.onselectstart = null
      },
      fixEvent: function(e) {
        e = e || window.event
        if ( e.pageX == null && e.clientX != null ) {
          var html = document.documentElement
          var body = document.body
          e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
          e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
        }
        if (!e.which && e.button) {
          e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
        }
        return e
      },
      getMouseOffset: function(target, e) {
        var docPos  = this.getPosition(target)
        return {x:e.pageX - docPos.x, y:e.pageY - docPos.y}
      },
      getPosition: function(e){
        var left = 0
        var top  = 0
        while (e.offsetParent){
          left += e.offsetLeft
          top  += e.offsetTop
          e    = e.offsetParent
        }
        left += e.offsetLeft
        top  += e.offsetTop
        return {x:left, y:top}
      }

    }


  }

</script>

