import Vue from 'vue';
import { RadioGroup, RadioButton, Button, Slider, Progress, Message } from 'element-ui';

export function install() {
    [
        RadioGroup,
        RadioButton,
        Button,
        Slider,
        Progress
    ].forEach(item => Vue.use(item));
    Vue.prototype.$message = Message;
}