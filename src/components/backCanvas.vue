<template>
  <canvas id='canvas'>
    emmmmm你的浏览器  不支持canvas呢
  </canvas>
</template>

<script>
  import Hsl from './Hsl.js'
  
  export default {
    data () {
        return {}
    },
    "methods": {

    },
    "props": {

    },
    "components": {

    },
    mounted(){
      const canvas =  document.getElementById('canvas')
      canvas.width = '1000'
      canvas.height = '1000'

      const ctx = canvas.getContext('2d');
      const backColor = new Hsl(192,.28,.21)
      ctx.fillStyle = backColor.str()
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // // 1个背景
      // // 4个大块
      // for(let i = 0;i < 4; i++){
      //   ctx.fillStyle = backColor.sto(.28 +  0.05 * (Math.random() - 0.5)).lto(.21 +  0.05 * (Math.random() - 0.5)).str()
      //   const startPostX = Math.floor(Math.random() * 2000)
      //   const startPostY = Math.floor(Math.random() * 2000)
      //   const size = Math.floor(Math.random() * 160) + 80
      //   ctx.fillRect(startPostX, startPostY, size, size);
      // }
      // // 16个中块
      // for(let i = 0;i < 16; i++){
      //   ctx.fillStyle = backColor.sto(.28 +  0.05 * (Math.random() - 0.5)).lto(.21 +  0.05 * (Math.random() - 0.5)).str()
      //   const startPostX = Math.floor(Math.random() * 2000)
      //   const startPostY = Math.floor(Math.random() * 2000)
      //   const size = Math.floor(Math.random() * 40) + 20
      //   ctx.fillRect(startPostX, startPostY, size, size);
      // }
      // // 64个小块
      // for(let i = 0;i < 64; i++){
      //   ctx.fillStyle = backColor.sto(.28 +  0.05 * (Math.random() - 0.5)).lto(.21 +  0.05 * (Math.random() - 0.5)).str()
      //   const startPostX = Math.floor(Math.random() * 2000)
      //   const startPostY = Math.floor(Math.random() * 2000)
      //   const size = Math.floor(Math.random() * 20) + 10
      //   ctx.fillRect(startPostX, startPostY, size, size);
      // }
      // // 1024个超级小块
      // for(let i = 0;i < 1024; i++){
      //   ctx.fillStyle = backColor.sto(.28 +  0.05 * (Math.random() - 0.5)).lto(.21 +  0.05 * (Math.random() - 0.5)).str()
      //   const startPostX = Math.floor(Math.random() * 2000)
      //   const startPostY = Math.floor(Math.random() * 2000)
      //   const size = Math.floor(Math.random() * 10) + 5
      //   ctx.fillRect(startPostX, startPostY, size, size);
      // }
    }
  }
</script>