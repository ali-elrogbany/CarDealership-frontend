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
    engineTypeCarsPage: boolean = false;

    engineTypeName: string = "";

    featuredCars: any = [];
    catalogueCars: any = [];
    newArrivalCars: any = [];
    engineTypeCars: any = [];

    selectedCar: any;

    displayedCars: any[] = []; // Array to hold the cars to be displayed on current page
    itemsPerPage: number = 1; // Number of cars to display per page
    currentPage: number = 1; // Current page number
    totalPages: number = 0; // Total number of pages

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
        this.engineTypeCarsPage = false;

        this.currentPage = 1;
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
                this.totalPages = Math.ceil(this.catalogueCars.length / this.itemsPerPage);
                this.updateDisplayedCars();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    SetSelectedCar(car: any): void {
        this.selectedCar = car;
    }

    SetEngineTypePage(_engineType: string) {
        if (_engineType == "Fuel" || _engineType == "Hybrid" || _engineType == "Electric") {
            this.engineTypeName = _engineType;
            this.http.get(environment.BackEndUrl + "/api/car?engineType=" + _engineType).subscribe(
                (data) => {
                    this.engineTypeCars = data;
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    updateDisplayedCars() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedCars = this.catalogueCars.slice(startIndex, startIndex + this.itemsPerPage);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedCars();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedCars();
        }
    }

    goToPage(pageNumber: number) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.currentPage = pageNumber;
            this.updateDisplayedCars();
        }
    }

    getTotalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }
}
