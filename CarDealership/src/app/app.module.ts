import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CarouselModule } from "ngx-owl-carousel-o";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

@NgModule({
    declarations: [AppComponent, MainPageComponent],
    imports: [BrowserModule, BrowserAnimationsModule, CarouselModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule, FormsModule, MatSelectModule, MatSliderModule, MatButtonModule, MatFormFieldModule, NgxMatSelectSearchModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
