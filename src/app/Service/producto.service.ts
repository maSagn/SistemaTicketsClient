import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductoModel } from '../Interface/ProductoModel';
import { Result } from '../Interface/Result';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = "http://" + environment.ipUrl + ":8081/api/producto";

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProductoModel[]> {
    return this.http.get<Result<ProductoModel[]>>(this.url).pipe(
      map(response => response.object)
    );
  }

  getById(idProducto: number): Observable<ProductoModel> {
    return this.http.get<Result<ProductoModel>>(`${this.url}/${idProducto}`).pipe(
      map(response => response.object)
    );
  }
  add(producto: ProductoModel): Observable<ProductoModel> {
    return this.http.post<Result<ProductoModel>>(this.url, producto).pipe(
      map(response => response.object)
    );
  }

  update(producto: ProductoModel, idProducto: number): Observable<ProductoModel> {
    return this.http.patch<Result<ProductoModel>>(`${this.url}/${idProducto}`, producto).pipe(
      map(response => response.object)
    );
  }

  delete(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${idProducto}`);
  }
}
