import React, { Component } from 'react'
import { Row, Col, Select, Form, Input, Button, DatePicker } from 'antd'

import html2canvas from 'html2canvas'

import './index.css'

const { Option, OptGroup } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

class Tool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'A3',
      prop: '个人事务',
      hour: 0.5,
      startTime: '',
      endTime: '',
      reason: '回家生孩子',
      today: this.getTime(new Date()),
      result: ''
    }
  }

  handleChange(value) {
    this.setState({
      type: value.split(',')[0],
      prop: value.split(',')[1]
    })
  }

  setDataTime(data) {
    let param = {
      startTime: '',
      endTime: ''
    }
    if (data) {
      const [startTime, endTime] = data
      param['startTime'] = this.getTime(startTime._d)
      param['endTime'] = this.getTime(endTime._d)
    }
    this.setState(param)
  }

  setHour(e) {
    this.setState({
      hour: e.target.value.trim()
    })
  }

  handlerTextareaInput = (e) => {
    this.setState({
      reason: e.target.value.trim()
    })
  }

  getFormInfo() {
    const { type, hour, startTime, endTime, reason, prop, today } = this.state
    let result = `
      <p style='text-align:center;'>请假申请</p>
      <p>1. 类型：${type}</p>
      <p>2. 申请人时间：${startTime} 至 ${endTime}, 共${hour}小时</p>
      <p>3. 事由：${reason}</p>
      <p>4. 性质：${prop}</p>
      <p>5. 申请人：郭风（ 上海乙十生物医疗科技有限公司-技术部）</p>
      <p style='text-align:right;'>盼批准，谢谢！</p>
      <p style='text-align:right;'>员工：郭风</p>
      <p style='text-align:right;'>申请日期：${today}</p>                              
    `
    this.setState(
      {
        result
      },
      () => {
        html2canvas(document.getElementById('cvs')).then((cvs) => {
          document.body.appendChild(cvs)
        })
      }
    )
  }

  getTime = (_time) => {
    let time = new Date(_time)
    var y = this.zeroBu(time.getFullYear()) //年
    var m = this.zeroBu(time.getMonth() + 1) //月
    var d = this.zeroBu(time.getDate()) //日
    var h = this.zeroBu(time.getHours()) //时
    var mm = this.zeroBu(time.getMinutes()) //分
    var s = this.zeroBu(time.getSeconds()) //秒
    var times = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    return times
  }
  //补零函数
  zeroBu = (n) => (n < 10 ? '0' + n : n)

  render() {
    return (
      <>
        <Form
          className='form'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 10 }}
          layout='horizontal'
          initialValues={{ size: 'default' }}
          size={'default'}>
          <Form.Item label='请假类型'>
            <Select defaultValue='A3' onChange={(Event) => this.handleChange(Event)}>
              <OptGroup label='A类型 [提前请假]'>
                <Option value='A1,病假'>A1.病假</Option>
                <Option value='A2,带薪假期如婚假'>A2.带薪假期如婚假</Option>
                <Option value='A3,个人事务'>A3.个人事务</Option>
              </OptGroup>
              <OptGroup label='B类型 [当天请假]'>
                <Option value='B1,个人身体健康状况异常严重(急性症状)'>B1.个人身体健康状况异常严重(急性症状)</Option>
                <Option value='B2,直系家属突发事件需配合紧急处理'>B2.直系家属突发事件需配合紧急处理</Option>
                <Option value='B3,因不可抗力导致的外界因素'>B3.因不可抗力导致的外界因素</Option>
              </OptGroup>
            </Select>
          </Form.Item>
          <Form.Item label='请假时间'>
            <RangePicker style={{ width: '100%' }} showTime onChange={(Event) => this.setDataTime(Event)} />
          </Form.Item>
          <Form.Item label='时长(小时)'>
            <Input
              placeholder='单位/小时'
              value={this.state.hour}
              maxLength={3}
              onChange={(Event) => this.setHour(Event)}
            />
          </Form.Item>
          <Form.Item label='请假事由'>
            <TextArea rows={4} onChange={(Event) => this.handlerTextareaInput(Event)} />
          </Form.Item>
        </Form>
        <Row>
          <Col span='8'></Col>
          <Col span='10'>
            <Button onClick={(Event) => this.getFormInfo(Event)} type='primary' block>
              生成数据
            </Button>
          </Col>
        </Row>

        <Row>
          <Col span='8'></Col>
          <Col span='10'>
            <div id='cvs' dangerouslySetInnerHTML={{ __html: this.state.result }}></div>
          </Col>
        </Row>
      </>
    )
  }
}

export default Tool
