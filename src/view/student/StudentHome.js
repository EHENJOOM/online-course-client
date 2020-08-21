import React, {Component} from 'react';
import Style from "../view.module.css";
import BannerAnim, {Arrow, Element, Thumb} from 'rc-banner-anim';
import TweenOne, {TweenOneGroup} from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import './banner.css';

const BgElement = Element.BgElement;

class StudentHome extends Component {

    constructor(props) {
        super(props);
        this.imgArray = [
            'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
            'https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg',
        ];
        this.state = {
            intShow: 0,
            prevEnter: false,
            nextEnter: false,
            thumbEnter: false,
        };
        [
            'onChange',
            'prevEnter',
            'prevLeave',
            'nextEnter',
            'nextLeave',
            'onMouseEnter',
            'onMouseLeave',
        ].forEach((method) => this[method] = this[method].bind(this));
    }

    render() {
        const intArray = this.getNextPrevNumber();
        const thumbChildren = this.imgArray.map((img, i) =>
            <span key={i}><i style={{ backgroundImage: `url(${img})` }} /></span>
        );
        return (
            <div className={Style.parent}>
                <BannerAnim onChange={this.onChange} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} prefixCls="custom-arrow-thumb">
                    <Element key="aaa" prefixCls="banner-user-elem">
                        <BgElement key="bg" className="bg" style={{backgroundImage: `url(${this.imgArray[0]})`}}/>
                        <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
                            技术成就未来
                        </TweenOne>
                        <TweenOne className="banner-user-text" animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}>
                            互联网时代&nbsp;&nbsp;科技引领&nbsp;&nbsp;走向未来
                        </TweenOne>
                    </Element>
                    <Element key="bbb" prefixCls="banner-user-elem">
                        <BgElement key="bg" className="bg" style={{backgroundImage: `url(${this.imgArray[1]})`,}}/>
                        <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
                            内容博客
                        </TweenOne>
                        <TweenOne className="banner-user-text" animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}>
                            原创博客&nbsp;&nbsp;手把手带你&nbsp;&nbsp;从入门到精通
                        </TweenOne>
                    </Element>
                    <Arrow arrowType="prev" key="prev" prefixCls="user-arrow" component={TweenOne} onMouseEnter={this.prevEnter} onMouseLeave={this.prevLeave} animation={{ left: this.state.prevEnter ? 0 : -120 }}>
                        <div className="arrow"></div>
                        <TweenOneGroup enter={{ opacity: 0, type: 'from' }} leave={{ opacity: 0 }} appear={false} className="img-wrapper" component="ul">
                            <li style={{ backgroundImage: `url(${this.imgArray[intArray[0]]})`}} key={intArray[0]} />
                        </TweenOneGroup>
                    </Arrow>
                    <Arrow arrowType="next" key="next" prefixCls="user-arrow" component={TweenOne} onMouseEnter={this.nextEnter} onMouseLeave={this.nextLeave} animation={{ right: this.state.nextEnter ? 0 : -120 }}>
                        <div className="arrow"></div>
                        <TweenOneGroup enter={{ opacity: 0, type: 'from' }} leave={{ opacity: 0 }} appear={false} className="img-wrapper" component="ul">
                            <li style={{ backgroundImage: `url(${this.imgArray[intArray[1]]})`}} key={intArray[1]} />
                        </TweenOneGroup>
                    </Arrow>
                    <Thumb prefixCls="user-thumb" key="thumb" component={TweenOne} animation={{ bottom: this.state.thumbEnter ? 0 : -70 }}>
                        {thumbChildren}
                    </Thumb>
                </BannerAnim>
            </div>
        );
    }

    onChange(type, int) {
        if (type === 'before') {
            this.setState({
                intShow: int,
            });
        }
    }

    getNextPrevNumber() {
        let nextInt = this.state.intShow + 1;
        let prevInt = this.state.intShow - 1;
        if (nextInt >= this.imgArray.length) {
            nextInt = 0;
        }
        if (prevInt < 0) {
            prevInt = this.imgArray.length - 1;
        }

        return [prevInt, nextInt];
    }

    prevEnter() {
        this.setState({
            prevEnter: true,
        });
    }

    prevLeave() {
        this.setState({
            prevEnter: false,
        });
    }

    nextEnter() {
        this.setState({
            nextEnter: true,
        });
    }

    nextLeave() {
        this.setState({
            nextEnter: false,
        });
    }

    onMouseEnter() {
        this.setState({
            thumbEnter: true,
        });
    }

    onMouseLeave() {
        this.setState({
            thumbEnter: false,
        });
    }
}

export default StudentHome;