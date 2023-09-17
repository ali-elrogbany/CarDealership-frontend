import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { OwlOptions } from "ngx-owl-carousel-o";
import { MatSelect } from "@angular/material/select";
import { MatSliderRangeThumb } from "@angular/material/slider";

@Component({
    selector: "app-main-page",
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.css"],
})
export class MainPageComponent implements OnInit {
    @ViewChild("carMakeSelect") carMakeSelect!: MatSelect;
    @ViewChild("carModelSelect") carModelSelect!: MatSelect;
    @ViewChild("carColorSelect") carColorSelect!: MatSelect;
    @ViewChild("carConditionSelect") carConditionSelect!: MatSelect;

    mainPage: boolean = true;
    cataloguePage: boolean = false;
    singleItemPage: boolean = false;
    newArrivalsPage: boolean = false;
    engineTypeCarsPage: boolean = false;
    contactPage: boolean = false;

    engineTypeName: string = "";

    featuredCars: any = [];
    catalogueCars: any = [];
    newArrivalCars: any = [];
    engineTypeCars: any = [];

    carMakes: any = [];
    carModels: any = [];
    carColors: any = [];
    carConditions: any = [];

    filteredCars: any = [];
    filteredCarMakes: any = [];
    filteredCarModels: any = [];
    filteredCarColors: any = [];
    filteredCarConditions: any = [];
    searchTerm: string = "";

    selectedCar: any;

    selectedCarMake: any;
    selectedCarModel: any;
    selectedCarColor: any;
    selectedCarCondition: any;
    selectedMinYear: number = 2000;
    selectedMaxYear: number = new Date().getFullYear();
    selectedMinMilage: number = 0;
    selectedMaxMilage: number = 500000;

    displayedCars: any[] = []; // Array to hold the cars to be displayed on current page
    itemsPerPage: number = 8; // Number of cars to display per page
    currentPage: number = 1; // Current page number
    totalPages: number = 0; // Total number of pages

    contactFormData: any = {
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        body: "",
        carID: null,
    };

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
        this.http.get(environment.BackEndUrl + "/api/conditions").subscribe(
            (data) => {
                this.carConditions = data;
                this.filteredCarConditions = this.carConditions;
                this.http.get(environment.BackEndUrl + "/api/colors").subscribe(
                    (data) => {
                        this.carColors = data;
                        this.filteredCarColors = this.carColors;
                        this.http.get(environment.BackEndUrl + "/api/car-makes").subscribe(
                            (data) => {
                                this.carMakes = data;
                                this.filteredCarMakes = this.carMakes;
                                this.http.get(environment.BackEndUrl + "/api/car-models").subscribe(
                                    (data) => {
                                        this.carModels = data;
                                        this.filteredCarModels = this.carModels;
                                        this.http.get(environment.BackEndUrl + "/api/car?featured=True").subscribe(
                                            (data) => {
                                                this.featuredCars = data;
                                            },
                                            (error) => {
                                                console.log(error);
                                            }
                                        );
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            },
            (error) => {
                console.log(error);
            }
        );
    }

    DisableAllViews(reset: boolean): void {
        this.mainPage = false;
        this.cataloguePage = false;
        this.singleItemPage = false;
        this.newArrivalsPage = false;
        this.engineTypeCarsPage = false;
        this.contactPage = false;

        if (reset) {
            this.displayedCars = [];
            this.currentPage = 1;
            this.totalPages = 0;
            this.selectedCar = null;
            this.filteredCars = [];
            this.contactFormData = {
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                body: "",
                carID: null,
            };
            this.selectedCarMake = null;
            this.selectedCarModel = null;
            this.selectedCarColor = null;
            this.selectedCarCondition = null;
            this.selectedMinYear = 2000;
            this.selectedMaxYear = new Date().getFullYear();
            this.selectedMinMilage = 0;
            this.selectedMaxMilage = 500000;
        }
    }

    GetNewArrivals(): void {
        if (this.newArrivalCars.length <= 0) {
            this.http.get(environment.BackEndUrl + "/api/car?newArrivals=True").subscribe(
                (data) => {
                    this.newArrivalCars = data;
                    this.totalPages = Math.ceil(this.newArrivalCars.length / this.itemsPerPage);
                    this.updateDisplayedCars(this.newArrivalCars);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    GetCatalogueItems(): void {
        this.cataloguePage = true;
        this.http.get(environment.BackEndUrl + "/api/car").subscribe(
            (data) => {
                this.catalogueCars = data;
                this.filteredCars = this.catalogueCars;
                this.totalPages = Math.ceil(this.catalogueCars.length / this.itemsPerPage);
                this.updateDisplayedCars(this.catalogueCars);
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
        this.engineTypeCarsPage = true;
        if (_engineType == "Fuel" || _engineType == "Hybrid" || _engineType == "Electric") {
            this.engineTypeName = _engineType;
            this.http.get(environment.BackEndUrl + "/api/car?engineType=" + _engineType).subscribe(
                (data) => {
                    this.engineTypeCars = data;
                    this.filteredCars = this.engineTypeCars;
                    this.totalPages = Math.ceil(this.engineTypeCars.length / this.itemsPerPage);
                    this.updateDisplayedCars(this.engineTypeCars);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    updateDisplayedCars(array: any) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedCars = array.slice(startIndex, startIndex + this.itemsPerPage);
    }

    previousPage(array: any) {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedCars(array);
        }
    }

    nextPage(array: any) {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedCars(array);
        }
    }

    goToPage(pageNumber: number, array: any) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.currentPage = pageNumber;
            this.updateDisplayedCars(array);
        }
    }

    getTotalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    PrepContactForm(): void {
        this.contactFormData.subject = this.selectedCar.year + " " + this.selectedCar.carModel.carMake + " " + this.selectedCar.carModel.name;
        this.contactFormData.carID = this.selectedCar.id;
    }

    SendContactForm(): void {
        this.http.post(environment.BackEndUrl + "/api/messages", this.contactFormData).subscribe(
            (data) => {
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    filterCarMakes(searchTerm: string): void {
        if (searchTerm === "") {
            this.filteredCarMakes = this.carMakes;
        } else {
            this.filteredCarMakes = this.carMakes.filter((car: any) => car.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
    }

    MakeChange(data: any): void {
        if (this.selectedCarMake) {
            this.carModelSelect.value = null;
        }
        this.filterCarModels(data, "");
    }

    filterCarModels(make: string, searchTerm: string): void {
        if (make === "") {
            if (searchTerm === "") {
                this.filteredCarModels = this.carModels;
            } else {
                this.filteredCarModels = this.carModels.filter((car: any) => car.name.toLowerCase().includes(searchTerm.toLowerCase()));
            }
        } else {
            if (searchTerm === "") {
                this.filteredCarModels = this.carModels.filter((car: any) => {
                    return car.carMake == make;
                });
            } else {
                this.filteredCarModels = this.carModels.filter((car: any) => car.carMake == make);
                this.filteredCarModels = this.filteredCarModels.filter((car: any) => car.name.toLowerCase().includes(searchTerm.toLowerCase()));
            }
        }
    }

    FilterCarColor(searchTerm: string): void {
        if (searchTerm == "") {
            this.filteredCarColors = this.carColors;
        } else {
            this.filteredCarColors = this.carColors.filter((color: any) => color.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
    }

    FilterCarCondition(searchTerm: string): void {
        if (searchTerm == "") {
            this.filteredCarConditions = this.carConditions;
        } else {
            this.filteredCarConditions = this.filteredCarConditions.filter((condition: any) => condition.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
    }

    resetMakeSearch(): void {
        this.searchTerm = "";
        this.filterCarMakes("");
    }

    resetModelSearch(data: any): void {
        this.searchTerm = "";
        this.filterCarModels(data, "");
    }

    ResetColorSearch(): void {
        this.searchTerm = "";
        this.FilterCarColor("");
    }

    ResetConditionSearch(): void {
        this.searchTerm = "";
        this.FilterCarCondition("");
    }

    handleSelectOpened(opened: boolean): void {
        if (!opened) {
            this.searchTerm = "";
            this.resetMakeSearch;
            // this.resetModelSearch(this.selectedCarMake);
            this.ResetColorSearch;
            this.ResetConditionSearch;
        }
    }

    async FilterCars(page: any, carMake: any, carModel: any, carColor: any, minYear: any, maxYear: any, condition: any, minMilage: any, maxMilage: any): Promise<void> {
        if (page == "catalogue") {
            this.filteredCars = this.catalogueCars;
        } else if (page == "engineType") {
            this.filteredCars = this.engineTypeCars;
        }

        if (carMake) {
            await this.filterByCarMake(carMake);
        }

        if (carModel) {
            await this.filterByCarModel(carModel);
        }

        if (carColor) {
            await this.filterByCarColor(carColor);
        }

        if (minYear) {
            await this.filterByMinYear(minYear);
        } else {
            await this.filterByDefaultMinYear();
        }

        if (maxYear) {
            await this.filterByMaxYear(maxYear);
        } else {
            await this.filterByDefaultMaxYear();
        }

        if (condition) {
            await this.filterByCondition(condition);
        }

        if (minMilage) {
            await this.filterByMinMilage(minMilage);
        } else {
            await this.filterByDefaultMinMilage();
        }

        if (maxMilage) {
            await this.filterByMaxMilage(maxMilage);
        } else {
            await this.filterByDefaultMaxMilage();
        }

        this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
        this.updateDisplayedCars(this.filteredCars);
    }

    ResetFilteredCars(page: any): void {
        this.carMakeSelect.value = null;
        if (this.selectedCarMake) {
            this.carModelSelect.value = null;
        }
        this.carColorSelect.value = null;
        this.carConditionSelect.value = null;

        this.selectedCarMake = null;
        this.selectedCarModel = null;
        this.selectedCarColor = null;
        this.selectedCarCondition = null;
        this.selectedMinYear = 2000;
        this.selectedMaxYear = new Date().getFullYear();
        this.selectedMinMilage = 0;
        this.selectedMaxMilage = 500000;

        if (page == "catalogue") {
            this.filteredCars = this.catalogueCars;
        } else if (page == "engineType") {
            this.filteredCars = this.engineTypeCars;
        }

        this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
        this.updateDisplayedCars(this.filteredCars);
    }

    ///////////////////////////////////////////////////
    //                                               //
    //               Helper Functions                //
    //                                               //
    ///////////////////////////////////////////////////

    async filterByCarMake(carMake: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.carModel.carMake == carMake;
        });
    }

    async filterByCarModel(carModel: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.carModel.name == carModel;
        });
    }

    async filterByCarColor(carColor: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.color == carColor;
        });
    }

    async filterByMinYear(minYear: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.year >= minYear;
        });
    }

    async filterByDefaultMinYear(): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.year >= 2000;
        });
    }

    async filterByMaxYear(maxYear: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.year <= maxYear;
        });
    }

    async filterByDefaultMaxYear(): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.year <= new Date().getFullYear();
        });
    }

    async filterByCondition(condition: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return car.condition == condition;
        });
    }

    async filterByMinMilage(minMilage: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return Number(car.milage) >= minMilage;
        });
    }

    async filterByDefaultMinMilage(): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return Number(car.milage) >= 0;
        });
    }

    async filterByMaxMilage(maxMilage: any): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return Number(car.milage) <= maxMilage;
        });
    }

    async filterByDefaultMaxMilage(): Promise<void> {
        this.filteredCars = this.filteredCars.filter((car: any) => {
            return Number(car.milage) <= 500000;
        });
    }
}
