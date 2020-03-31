import Vue from 'vue'
import {
  Button,
  Form, FormItem, Input,
  Container, Aside, Header, Main,
  Message,
  Menu, MenuItem, MenuItemGroup, Submenu, DropdownMenu, DropdownItem, Dropdown,
  Breadcrumb, BreadcrumbItem,
  Card,
  Row, Col,
  Table, TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select, Option,
  Cascader,
  Alert,
  Tabs, TabPane,
  Steps, Step,
  Radio, RadioGroup, RadioButton,
  Upload,
  Progress,
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dropdown)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)

Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)

Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)

Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)

Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)


Vue.use(Upload)
Vue.use(Progress)
