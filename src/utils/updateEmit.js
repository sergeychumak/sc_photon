/**
 * Обновляет контент в шапку главного компонента
 *
 * Обязательно
 * 1. css: 
 * .isHook { display: none; }
 *
 * 2. html - ref <router-view ref="rView"></router-view>
 * 3. html - hook
 
  <div class="isHook">
    <div ref="isHook__Name" class="blue--text">
      / {{$t('pagesTitle.referenceBook')}} / {{$t('pagesTitle.referenceBookUsers')}}
    </div>
  </div>

 <div class="isHook">
  <div ref="isHook__Actions">
    {{count}}
  </div>
 </div>
 * 
 * */

export const UpdateEmit = {
  mounted: function(){
    this.__reloadHook()
  },
  updated: function(){
    this.__reloadHook()
  },

  methods: {
    __reloadHook: function(refs = this.$refs){
      if ('rView' in refs) {
        if (refs.rView){
          this.__reloadHook(refs.rView.$refs)
        }else{
          this.__insertHook(refs)
        }
      }else{
        this.__insertHook(refs)
      }
    },
    __insertHook: function(refs){
      if (Object.keys(this.$refs).length > 0){
        this.$refs.isHook__Name_main.innerHTML = ""
        if (refs.isHook__Name)
          this.$refs.isHook__Name_main.appendChild(refs.isHook__Name)
        this.$refs.isHook__Actions_main.innerHTML = ""
        if (refs.isHook__Actions)
          this.$refs.isHook__Actions_main.appendChild(refs.isHook__Actions)
      }
    }
  }
}
