import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import * as echarts from "echarts";
import {NewsModel} from "./Models/NewsModel";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  apiKey:string = 'ecc267255acdcb06ca7bb19b64e8dd81';
  city:string = "Kyiv";

  place_weather:string = "";
  temperature:number = 0;
  temperature_feels:number = 0;
  type_weather:string = "";
  kelvin_temperature:number = 273.15;

  url_weather_image:string = "";
  lat:number = 0;
  lon:number = 0;
  weather_week_data: number[] = [];
  weather_three_days_data:any[] = [];



  newsList: NewsModel[] = [
    new NewsModel( 'Before the weekend, the weather in Ukraine stabilizes','https://images.unian.net/photos/2021_06/thumb_files/370_250_1623733565-6354.jpg','Ukraine'),
    new NewsModel( 'Tomorrow the people of Kiev are waiting for a dry and warm day, then a sharp cold snap','https://images.unian.net/photos/2022_05/thumb_files/370_250_1653673938-2419.jpg','Ukraine Kyiv'),
    new NewsModel('In the USA in the Death Valley, the hellish heat "killed" the tourist: the temperature went off scale','https://images.unian.net/photos/2023_07/thumb_files/370_250_1689515804-6158.jpg','USA'),
    new NewsModel( 'There was a double flash on the Sun: the Earth was under attack','https://images.unian.net/photos/2021_05/thumb_files/370_250_1621335221-8197.jpg','World'),
  ];

  async search_click() {
    console.log(this.lat + " , " + this.lon);
      await this.get_day_weather();
      await this.get_week_weather();
      this.drawChart();
  }

  async ngOnInit() {
   await this.get_day_weather();
   await this.get_week_weather();
   this.drawChart();
  }


  async get_day_weather(){
   await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${(this.city)}&appid=${(this.apiKey)}`)
      .then(response => response.json())
      .then(data => {
        this.lon = data.coord.lon;
        this.lat = data.coord.lat;
        this.place_weather = this.city + ", " + data.sys.country;
        this.temperature = Math.floor(data.main.temp - this.kelvin_temperature);
        this.temperature_feels = Math.floor(data.main.feels_like - this.kelvin_temperature);
        this.type_weather = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.substring(1);

        if(this.type_weather.includes("rain"))
          this.url_weather_image = "../assets/rain.png";
        else if(this.type_weather.includes("cloud"))
          this.url_weather_image = "../assets/clouds.png";
        else if(this.type_weather.includes("sunny"))
          this.url_weather_image = "../assets/sunny.png";
        else if(this.type_weather.includes("storm"))
          this.url_weather_image = "../assets/storm-4k.jpg";
        else
          this.url_weather_image = "../assets/sunny.png";


      })
      .catch(error => {
        alert("Invalid input (Check input value)")
      });
  }

  async get_week_weather() {
    this.weather_three_days_data= [];
    await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${(this.lat)}&lon=${(this.lon)}&appid=${(this.apiKey)}`)
      .then(response => response.json())
      .then(data => {
        let temp_item:any[] = [];
        data.list.forEach((item: any) => {
          this.weather_week_data.push(item.main.temp - this.kelvin_temperature);
          temp_item.push(item);
        });
        this.weather_three_days_data.push(temp_item[0]);
        this.weather_three_days_data.push(temp_item[5]);
        this.weather_three_days_data.push(temp_item[10]);
        for(let i = 0; i < this.weather_three_days_data.length;i++){
          if(this.weather_three_days_data[i].weather[0].main.includes("Rain"))
            this.weather_three_days_data[i].imageUrl = "https://img.icons8.com/arcade/256/rain.png";
          else if(this.weather_three_days_data[i].weather[0].main.includes("Clouds"))
            this.weather_three_days_data[i].imageUrl = "https://img.icons8.com/arcade/256/clouds.png";
          else if(this.weather_three_days_data[i].weather[0].main.includes("Sun"))
            this.weather_three_days_data[i].imageUrl = "https://img.icons8.com/arcade/256/sun.png";
          else if(this.weather_three_days_data[i].weather[0].main.includes("Snow"))
            this.weather_three_days_data[i].imageUrl = "https://img.icons8.com/arcade/256/snow.png";
          else
            this.weather_three_days_data[i].imageUrl = "https://img.icons8.com/arcade/256/partly-cloudy-day.png";
        }



      })
      .catch(error => {
        console.error('Error: ' + error);
      });

    console.log(this.weather_week_data);
  }
  async drawChart(){
    const chart = echarts.init(document.getElementById('chart'));
    const option = {
      color: ['#0099cc'],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data:this.weather_week_data,
          type: 'line',
          areaStyle: {}
        }
      ]
    };

    await chart.setOption(option);

    this.weather_week_data = [];
  }

}

