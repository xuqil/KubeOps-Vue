<template>
  <div id="code_editor">
    <codemirror v-model="code" @changes="inputCheck" :options="cmOptions"/>
    <el-button type="info" @click="checkSyntax">语法检查</el-button>

    <el-dialog
      title="语法提示"
      :visible.sync="syntaxDialogVisible"
      width="70%"
      :before-close="handleClose">
      <span>{{result}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="syntaxDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-button
      plain
      @click="openTip">
      语法错误
    </el-button>
  </div>
</template>
<script>
  import "codemirror/theme/ambiance.css";
  import 'codemirror/mode/css/css.js';
  import "codemirror/lib/codemirror.css";

  import "codemirror/keymap/sublime.js"
  import "codemirror/addon/selection/active-line.js"

  //yaml
  import "codemirror/mode/yaml/yaml.js";
  import "codemirror/mode/yaml-frontmatter/yaml-frontmatter.js";

  import yaml from "js-yaml/dist/js-yaml.js";

  export default {
    name: "Editor",
    data() {
      return {
        code: '',
        cmOptions: {
          tabSize: 2,
          mode: 'yaml', //代码类型
          theme: 'ambiance', //主题
          lineNumbers: true, //行数
          lineWiseCopyCut: true,
          showCursorWhenSelecting: true,
          matchBrackets: true, //括号匹配
          autoCloseBrackets: true, // 自动闭合符号
          line: true,
          lineWrapping: true,    // 自动换行
          styleActiveLine: true, // 当前行背景高亮
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
          foldGutter: true, // 启用行槽中的代码折叠
          keyMap: "sublime", // 快键键风格
        },
        syntaxDialogVisible: false,
        result: '',
        syntaxCount: 20
      }
    },
    methods: {
      //语法检查
      checkSyntax() {
        let result = this.parseYaml(this.code);
        if (result !== '') {
          this.syntaxDialogVisible = true;
          this.result = result;
        } else {
          this.$message.success("检测通过!")
        }
      },
      handleClose() {
        this.result = '';
      },
      inputCheck() {
        let result = this.parseYaml(this.code);
        if (result !== '') {
          this.syntaxCount--;
          if (this.syntaxCount >= 0) {
            this.syntaxCount = 20;
            this.openTip(result);
          }
        }
      },
      openTip(value) {
        this.$notify.error({
          title: '语法错误',
          message: value
        });
      },
      //语法检测
      parseYaml(str) {
        let isYaml = false;
        let errorMessage = '';
        try {
          isYaml = yaml.load(str)
        } catch (e) {
          errorMessage = e && e.message;
        }
        return errorMessage
      }
    }
  }
</script>
<style>
  #code_editor .CodeMirror {
    height: 640px !important;
    width: auto !important;
    font-family: courier;
  }

  .el-button {
    margin-top: 10px;
    float: right;
  }
</style>
