import React, {Component} from 'react'
import { dataApi, videoServer} from '../Global';
import { Icon, Button, Select, message } from 'antd'
import Header from '../Utils/Header'
import Map from '../Utils/Map'
import VideoCrop from '../Utils/VideoCrop'
const Option = Select.Option

const cameras = [{key:1, x:'10%', y:'10%', url:'camera1',area:1}, {key:2, x:'30%',y:'30%',url:'camera2',area:1}]
const backgroundImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAAAQIDBv/EABgQAQEBAQEAAAAAAAAAAAAAAAABAhEh/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEGBf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOhkaSDMXI7jKlIrhyKkRUcHGnCsBnYixtYmxUYagXqeAFZjSRGWkRTkPhw+AQ4fAKmxFjRNgjKwHo1QstIzy0iKo0wxVFR0dQJNUmqiNAaCojNaSsM6XNA3lNlNKmkVYT0ugrqbU3SboBqhnrQVGeWmaAC5T6AA6OgAVqbSAItACj//2Q=="

const history = [{key:1, file:""}]
const videoType = "video/mp4"

class HistoryVideo extends Component {

    constructor(props){
        super(props)
        this.state={
            videoUrl: "test.mp4",
            cameras: cameras,
            visibility: "hidden",

            imgSrc: null,
            imageLoaded: false
        }
    }

    handleClick = () => {
        this.setState({visibility: "visible"})
    }

    handleChange = (value) => {
        this.setState({videoUrl: value, visibility: "hidden"})
    }

    getCamera = () => {
        fetch(dataApi + "/camera?all=false&area=1",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else
                    this.setState({
                        cameras: result,
                        videoUrl: result[0].url
                    })
            },
            (error) => {
                message.error(error)
            }
        )
    }

    render() {
        const videoUrl = videoServer + this.state.videoUrl
        const visibility = this.state.visibility
        console.log(videoUrl)
        return (
            <div style={{ background: '#ECECEC'}}>
                <header className="App-header">
                    <Header title="历史视频"/>
                    <Icon type="eye" style={{ fontSize: 70, color: 'aliceblue' }} />
                </header>
                <br/>

                
                <div className="select-container">
                    <h2>选择摄像头</h2>
                    <Select defaultValue="camera1" style={{ width: 120 }} onChange={this.handleChange}>
                    {
                        cameras.map((camera) => {
                            return <Option key={camera.key} id={camera.key} value={camera.url}>{"摄像头"+camera.key}</Option>
                        })
                    }
                    </Select>
                    <Button type="primary" size="large" onClick={this.handleClick}>播放</Button>
                    <br/><br/><br/>
                </div>

                <Map cameras={cameras} backgroundImage={backgroundImage}/>

                <br/><br/><br/>
                <VideoCrop videoUrl={videoUrl} visibility={visibility} videoType={videoType}/>
                
                <br/><br/>
            </div>
        )
    }
}
export default HistoryVideo