<template>
  <div id="code_editor">
    <codemirror
      v-model="code"
      :options="cmOptions"
      @changes="changes"/>
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

  //json
  import "codemirror/mode/javascript/javascript";
  import "codemirror/addon/lint/lint";
  import "codemirror/addon/lint/json-lint";

  import yaml from "js-yaml/dist/js-yaml.js";
  import {mapGetters} from "vuex";

  export default {
    name: "Editor",
    data() {
      return {
        code: 'acd',
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
          readOnly: false, //是否只读
        },
        syntaxDialogVisible: false,
        result: '',
        syntaxCount: 20
      }
    },
    created() {
      this.initCodeMirror()
    },
    methods: {
      ...mapGetters([
        'getCodeValue',
        'getCodeType',
        'getCodeReadOnly'
      ]),
      initCodeMirror() {
        this.cmOptions.mode = this.getCodeType();
        let read = this.getCodeReadOnly();
        this.cmOptions.readOnly = !(read === false || read === 'false');
        if (this.cmOptions.mode === 'application/json') {
          this.code = JSON.stringify(this.getCodeValue(), null, 2);
        } else {
          this.code = this.getCodeValue();
        }
      },
      changes() {
        this.$store.commit('saveCodeValue', this.code)
      },
      //语法检查
      checkSyntax() {
        if (this.cmOptions.mode === 'yaml') {
          let result = this.parseYaml(this.code);
          if (result !== '') {
            this.syntaxDialogVisible = true;
            this.result = result;
          } else {
            this.$message.success("检测通过!")
          }
        }
        this.$message.info('不是yaml格式支持检测,请自行检测')
      },
      handleClose() {
        this.result = '';
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
  .vue-codemirror {
    margin-bottom: 10px;
  }

  #code_editor {
    height: 100%;
    position: relative;
  }

  #code_editor .CodeMirror {
    height: auto;
    min-height: 180px;
    max-height: 900px;
    font-family: courier;
  }

  #code_editor .CodeMirror-scroll {
    min-height: 180px;
    max-height: 900px;
  }
</style>
