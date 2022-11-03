<template>
  <h2 class="title_vue">vue{{ title }}</h2>
  <p class="content_vue">内容{{ content }}</p>
</template>

<script>
export default {
  data() {
    return {
      title: '标题',
      content: '内容'
    }
  }
}
</script>

<style>
.title_vue {
  color: red;
  font-size: 40;
}

.content_vue {
  color: blueviolet;
  font-size: 30px;
}
</style>