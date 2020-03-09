import Vue from 'vue'
import { Button } from 'element-ui'
import {
  Form, FormItem,
  Input,
  Menu, MenuItem, MenuItemGroup, Submenu,Tooltip,
  Container, Header, Aside, Main,
  Icon, Image,
  Message,
  DropdownMenu, DropdownItem, Dropdown
} from 'element-ui'

//弹框提示
Vue.prototype.$message = Message;

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Tooltip);

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);

Vue.use(Icon);
Vue.use(Image);

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dropdown);
