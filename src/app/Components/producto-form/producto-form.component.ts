import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../Service/producto.service';
import { ProductoModel } from '../../Interface/ProductoModel';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent {
  productoForm!: FormGroup;
  idProducto!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      idProducto: [''],
      nombre: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    // Revisar si hay un Id en la ruta:
    this.idProducto = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idProducto) {
      this.productoService.getById(this.idProducto).subscribe(producto => {
        this.productoForm.patchValue({
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          precioUnitario: producto.precioUnitario,
          descripcion: producto.descripcion
        });
      });
    }
  }

  mensajeError: string = '';

  guardar() {
    if (this.productoForm.valid) {
      console.log("Form valido", this.productoForm.value);
      //const producto: ProductoModel = this.productoForm.value;
      const producto = {
        nombre: this.productoForm.value.nombre,
        precioUnitario: this.productoForm.value.precioUnitario,
        descripcion: this.productoForm.value.descripcion
      };

      if (this.idProducto) { // Editar
        this.productoService.update(producto, this.idProducto).subscribe(() => {
          Swal.fire({
            title: "¡Actualizado!",
            text: "El producto se ha actualizado exitosamente.",
            icon: "success"
          });

          this.router.navigate(['/productos']);
        })
      } else { // Agregar
        this.productoService.add(producto).subscribe({
          next: (response) => {
            Swal.fire({
              title: "¡Agregado!",
              text: "El producto se ha registrado correctamente.",
              icon: "success"
            });

            this.router.navigate(['/productos']);

          },
          error: (error) => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error",
              //text: this.mensajeError = error.error,
              icon: "error"
            });
          }
        });
      }
    }
  }
}
