import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
    mainPage: boolean = true;
    cataloguePage: boolean = false;
    singleItemPage: boolean = false;
    newArrivalsPage: boolean = false;

    featuredCars: any = [];
    catalogueCars: any = [];
    newArrivalCars: any = [];

    selectedCar: any;

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 600,
        navText: ["&#8249", "&#8250;"],
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 2,
            },
            760: {
                items: 3,
            },
            1000: {
                items: 4,
            },
        },
        nav: true,
    };

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get(environment.BackEndUrl + "/api/car?featured=True").subscribe(
            (data) => {
                this.featuredCars = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    DisableAllViews(): void {
        this.mainPage = false;
        this.cataloguePage = false;
        this.singleItemPage = false;
        this.newArrivalsPage = false;
    }

    GetNewArrivals(): void {
        if (this.newArrivalCars.length <= 0) {
            this.http.get(environment.BackEndUrl + "/api/car?newArrivals=True").subscribe(
                (data) => {
                    this.newArrivalCars = data;
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    GetCatalogueItems(): void {
        this.http.get(environment.BackEndUrl + "/api/car").subscribe(
            (data) => {
                this.catalogueCars = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    SetSelectedCar(car: any): void {
        this.selectedCar = car;
    }
}
