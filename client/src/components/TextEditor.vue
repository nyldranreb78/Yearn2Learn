<!--Provided by Tiptap documentation: https://tiptap.dev/docs/editor/getting-started/install/vue3-->
<template>
  <div class="bg-white shadow-sm">
    <QuillEditor
      theme="snow"
      toolbar="essential"
      style="min-height:100vh;"
    />
  </div>
</template>

<script setup>
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
</script>
