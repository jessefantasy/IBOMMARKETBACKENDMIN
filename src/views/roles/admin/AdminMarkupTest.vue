<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Store } from "../../../store/AdminStore.js";

import { onBeforeUnmount } from "vue";
import { Editor } from "@tiptap/vue-3";

const AdminStore = Store();

const router = useRouter();
if (!localStorage.getItem("ibmManagementToken")) {
  router.push("/login");
}

const show = ref(false);

const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [StarterKit, Document, Paragraph, Text],
  
});

onBeforeUnmount(() => {
  editor.destroy();
});
</script>

<template>
  <AsideAdmin />
  <main class="main-wrap">
    <div class="screen-overlay"></div>
    <Header />

    <section class="content-main">
      <div class="content-header">
        <editor-content :editor="editor" style="border: 1px solid red" />

        <template v-if="true">
          <div>
            <editor-content :editor="editor" />
            <button @click="show = !show">
              {{ show ? "Hide" : "Show" }} HTML
            </button>

            <pre v-if="show" class="preview">{{ editor?.getHTML() }}</pre>
          </div>
          <!-- inside <template> -->
          <br />
          <button @click="editor.chain().focus().toggleBold().run()">
            Bold
          </button>
          <button @click="editor.chain().focus().toggleItalic().run()">
            Italic
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            H1
          </button>
        </template>
      </div>
    </section>
  </main>
</template>
<style scoped>
.preview {
  background: #f9f9f9;
  padding: 1em;
  border-radius: 6px;
  margin-top: 1em;
  white-space: pre-wrap;
}
</style>
