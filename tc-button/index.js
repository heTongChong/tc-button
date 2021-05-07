import React, { Component } from 'react';
import { Checkbox } from 'antd-mobile';
import './index.less';
import PropTypes from "prop-types";

/**
 * 生成唯一字符串
 */
function uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';
    s[0] = 'abcdefghigklmnopqrst'.substr(Math.floor(Math.random() * 0x10), 1);
    return s.join('');
}

const propTypes = {
    options: PropTypes.array,  // 指定可选项
    defaultValue: PropTypes.array,	// 默认选中的选项
    disabled: PropTypes.bool,    // 整组失效
    onChange: PropTypes.func,    // 变化时回调函数
    direction: PropTypes.string, // 布局方向 horizontal(水平) vertical(垂直)
    multiple: PropTypes.bool,              //是否单选，默认为否
};

const defaultProps = {
    defaultValue: [],
    options: [],
    disabled: false,
    direction: "horizontal",
    multiple: false,              
    onChange: () => {
    },
};


/**
 * 为兼容不同项目传进来的options属性，本组件label兼容label/name，值兼容value/val
 */

class CheckboxGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue
        }

    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.defaultValue !== this.state.defaultValue) {
            this.setState({ defaultValue: nextProp.defaultValue });
        }
    }

    onChangeCheckbox = (valueItem) => {
        const { onChange, options, multiple } = this.props;
        const { defaultValue } = this.state;
        let currentValue = valueItem;
        if (valueItem.label || valueItem.name) {
            currentValue = valueItem.value || valueItem.val;
        }
        const activeIndex = defaultValue.indexOf(currentValue);

        // 区分单选多选
        if (multiple) {
            if (activeIndex > -1) {
                return;
            } else {
                onChange([currentValue]);
            }
        }else{
            let status = true;
            if (activeIndex > -1) {
                defaultValue.splice(activeIndex, 1);
                status = false;
            } else {
                defaultValue.push(currentValue);
            }
            onChange(defaultValue, status, currentValue);
        }

    }

    checkAll = () => {
        const { onChange, options } = this.props;
        const { defaultValue } = this.state;
        const valueArr = [];
        if (defaultValue.length != options.length) {
            if (options.length && (options[0].name || options[0].label)) {
                for (const item of options) {
                    valueArr.push(item.value || item.val);
                }
            }
        }
        this.setState({ defaultValue: valueArr });
        onChange(valueArr, status);
    }

    render() {
        const { defaultValue } = this.state;
        const { options, direction, disabled, name, allChoosable, show, multiple } = this.props;
        if (options && options.length && (!options[0].value)) {
            for (const item of options) {
                item.value = item.val;
            }
        }
        return (
            <ul className="screening-ul clear-fix checkboxGroup" style={{ display: show ? '' : 'none' }}>

                {/* 选项标题 */}
                {options && name && <li className="screening-col"><div className="col-bd">{name}</div></li>}

                {/* 是否可全选 */}
                {options && allChoosable && (!multiple) && <li className="screening-col">
                    <Checkbox
                        className={direction === 'horizontal' ? 'checkboxHorizontal' : 'checkboxVertical'}
                        key={"allChoosable"}
                        disabled={disabled}
                        checked={defaultValue.length == options.length}
                        onChange={this.checkAll}
                    >
                        <span className="checkbox-label">全选</span>
                    </Checkbox>
                </li>}

                {options &&
                    options.map((item, index) => {
                        return (
                            <li className="screening-col" key={uuid()}>
                                <Checkbox
                                    className={direction === 'horizontal' ? 'checkboxHorizontal' : 'checkboxVertical'}
                                    disabled={disabled || item.disabled}
                                    checked={item.value ? (defaultValue.includes(item.value) ? true : false) : (defaultValue.includes(item) ? true : false)}
                                    onChange={this.onChangeCheckbox.bind(this, item, index)}
                                >
                                    <span className="checkbox-label">{item.label || item.name || item}</span>
                                </Checkbox>
                            </li>
                        )
                    })}
            </ul>
        )
    }
}

CheckboxGroup.propTypes = propTypes;
CheckboxGroup.defaultProps = defaultProps;
export default CheckboxGroup;
