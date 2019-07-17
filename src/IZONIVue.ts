import { Mixins, Vue, Component } from "vue-property-decorator"

// You can declare a mixin as the same style as components.
@Component
export default class IZONIVue extends Vue {
    ISDEV: boolean = process.env.NODE_ENV === 'development'
    ROOTPATH: string = process.env.NODE_ENV === 'development' ? 'http://localhost:8360' : '';
    
    MEMBERSTABLE: {
        [memberName: string]: string
    } = {
        圆: '🐰',
        樱: '🌸',
        柔: '🐹',
        椰: '🐥',
        安: '🐶',
        奈: '🐦',
        权: '🍊',
        惠: '🍴',
        仁: '🍓',
        彩: '👗',
        珉: '🐸',
        燕: '💃',
    }
    $LOG(firstArg: any, ...restArg: any): void {
        if (this.ISDEV) {
            // tslint:disable-next-line
            console.log(firstArg, ...restArg)
        }
    }
    $ERROR(firstArg: any, ...restArg: any): void {
        if (this.ISDEV) {
            // tslint:disable-next-line
            console.error(firstArg, ...restArg)
        }
    }
    $RECORD = (a: any, b: any, c: any, d: any) => {
        const _hmt: any = (window as any)._hmt;
        _hmt.push(['_trackEvent', a, b, c, d]);
    }
}