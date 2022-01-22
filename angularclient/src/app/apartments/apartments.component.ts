import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../services/apartment.service';
import { Apartment } from '../models/apartment';
import { ActivatedRoute, RouterState } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {

  constructor(private apartmentService: ApartmentService,
              private route: ActivatedRoute) {
               }

  ngOnInit(): void {

    // Wait for the url, then act based on the url
    this.route.url.subscribe(p => {
      if(p[0].path === "byBuilding"){
        // Go to apartments by building
        this.route.params.subscribe( params => this.getByBuilding(params['id']))
      } else {
        // Go to all apartments
        this.getApartments()
      }
    })

  }

  apartmentForm = new FormGroup ({
    apartmentNumber: new FormControl("",[
      Validators.required
    ]),
    apartmentId: new FormControl(""),
    buildingId: new FormControl("")
  })

  // Takes in selected building when edit button is hit.
  selectedApartment?: Apartment;

  apartments: Apartment[] = []
  buildingId: number = 0

  getApartments(): void {
    this.apartmentService.getApartments().subscribe(apartment => this.apartments = apartment)
  }

  getByBuilding(buildingId: number): void {
    this.apartmentService.getByBuilding(buildingId).subscribe(apartment => this.apartments = apartment)
  }

  delete(apartment: Apartment): void {
    this.apartmentService.deleteApartment(apartment).subscribe(response => {
      if (response.status == 200) {
        // The for loop is slow but ensures the correct building is deleted.
        for(let i = 0; i < this.apartments.length; i++){
          if (this.apartments[i].apartmentId == response.body.apartmentId){
            console.log(this.apartments[i]);  
            this.apartments.splice(i, 1);
          }
        }
      } else {
        // Do nothing
      }
    });
  }

  // When 201 response is received, adds the model to the model list.
  add(postform: FormGroupDirective): void {

    // Get buildingId for the page from the url.  There may be a more efficient way to do this
    this.route.params.subscribe( params => this.buildingId = params['id']);
    this.apartmentForm.get("buildingId")?.setValue(this.buildingId);
    
    this.apartmentService.addApartment(this.apartmentForm.value).subscribe(response => {
      if (response.status == 201) {
        this.apartments.push(response.body);
    // Return form to empty
    postform.resetForm();
      } else {
        // Do nothing
      }
    });
  }

  handleFormSubmission( buttonClicked: string,
    postform: FormGroupDirective,
    apartment?: Apartment): void{


    if (buttonClicked == "add"){
      this.add(postform);
    } else if (buttonClicked == "edit"){

      postform.form.get("apartmentId")?.setValue(apartment?.apartmentId);
      postform.form.get("buildingId")?.setValue(apartment?.buildingId);

      console.log("Form1:", postform.form.get("buildingId")?.value);
      this.edit(postform);

      // Close form
      this.selectedApartment = undefined;
    }
  }

  edit(postform: FormGroupDirective): void {

    // Edited address is only necessary so that the add address portion 
    // of the form isn't populated with existing address when editing.
    let editedNumber: string = this.apartmentForm.get("editnumber")?.value;
    postform.form.get("apartmentNumber")?.setValue(editedNumber);
    postform.form.removeControl("editnumber");

    console.log("Form:", postform.form.get("buildingId")?.value);

    this.apartmentService.editApartment(postform.value).subscribe(response => {
      if (response.status == 200) {
        // The for loop is slow but ensures the correct apartment is updated.
        for(let i = 0; i < this.apartments.length; i++){
          if (this.apartments[i].apartmentId == response.body.apartmentId){
            this.apartments.splice(i, 1);
            this.apartments.push(response.body);
          }

        }
      } else {
        console.log("Something went wrong...")
        // Do nothing
      }
    });

    // Return form to empty
    postform.resetForm();

    // postform.form.get("address")?.setValue("");

  }

  
  selectForEditing(apartment: Apartment): void {

    // Edited address is only necessary so that the add address portion 
    // of the form isn't populated with existing address when editing.
    this.apartmentForm.setControl("editnumber", new FormControl(apartment.apartmentNumber))
    this.apartmentForm.get("editnumber")?.setValidators( 
      [Validators.required])
    // this.buildingForm.get("editaddress")?.setValue(building.address)
    this.selectedApartment = apartment;
  }

}
