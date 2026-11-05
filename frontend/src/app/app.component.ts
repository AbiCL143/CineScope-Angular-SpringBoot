import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';
import { MoviesService } from './services/movies.service';
import { FavoritesService } from './services/favorites.service';
import { Genre, Movie, Page, View } from './models/movie';
import { MovieCardComponent } from './components/movie-card.component';
import { MovieDetailComponent } from './components/movie-detail.component';
@Component({selector:'app-root',standalone:true,imports:[FormsModule,MovieCardComponent,MovieDetailComponent],templateUrl:'./app.component.html'})
export class AppComponent {
 readonly favorites=inject(FavoritesService);private readonly api=inject(MoviesService);private readonly destroyRef=inject(DestroyRef);
 readonly view=signal<View>('popular');readonly query=signal('');readonly activeQuery=signal('');readonly genre=signal(0);readonly genres=signal<Genre[]>([]);
 readonly movies=signal<Movie[]>([]);readonly loading=signal(false);readonly error=signal('');readonly page=signal(1);readonly totalPages=signal(1);readonly selected=signal<Movie|null>(null);readonly detailLoading=signal(false);readonly detailError=signal('');readonly modalOpen=signal(false);
 private request?:Subscription;private detailRequest?:Subscription;private debounce?:ReturnType<typeof setTimeout>;
 readonly displayed=computed(()=>{const list=this.view()==='favorites'?this.favorites.movies():this.movies();return this.genre()===0?list:list.filter(m=>m.genre_ids?.includes(this.genre())||m.genres?.some(g=>g.id===this.genre()));});
 readonly title=computed(()=>this.view()==='favorites'?'Mis favoritas':this.activeQuery()?`Resultados para “${this.activeQuery()}”`:this.view()==='top-rated'?'Mejor calificadas':'Películas populares');
 constructor(){this.api.genres().subscribe({next:r=>this.genres.set(r.genres),error:()=>{}});this.load();this.destroyRef.onDestroy(()=>{this.request?.unsubscribe();this.detailRequest?.unsubscribe();clearTimeout(this.debounce);});}
 changeView(view:View){this.view.set(view);this.query.set('');this.activeQuery.set('');this.genre.set(0);this.page.set(1);if(view!=='favorites')this.load();else {this.request?.unsubscribe();this.loading.set(false);this.error.set('');}}
 onSearch(value:string){this.query.set(value);clearTimeout(this.debounce);this.debounce=setTimeout(()=>{this.activeQuery.set(value.trim());this.page.set(1);if(this.view()==='favorites')this.view.set('popular');this.load();},400);}
 changePage(page:number){if(page<1||page>this.totalPages())return;this.page.set(page);this.load();window.scrollTo({top:0,behavior:'smooth'});}
 load(){if(this.view()==='favorites')return;this.request?.unsubscribe();this.loading.set(true);this.error.set('');const obs=this.activeQuery()?this.api.search(this.activeQuery(),this.page()):this.view()==='top-rated'?this.api.topRated(this.page()):this.api.popular(this.page());this.request=obs.pipe(finalize(()=>this.loading.set(false))).subscribe({next:(data:Page<Movie>)=>{this.movies.set(data.results);this.totalPages.set(Math.min(data.total_pages,500));},error:e=>{this.movies.set([]);this.error.set(this.message(e));}});}
 openDetails(movie:Movie){this.modalOpen.set(true);this.selected.set(null);this.detailError.set('');this.detailLoading.set(true);this.detailRequest?.unsubscribe();this.detailRequest=this.api.details(movie.id).pipe(finalize(()=>this.detailLoading.set(false))).subscribe({next:m=>this.selected.set(m),error:e=>this.detailError.set(this.message(e))});this.lastId=movie.id;}
 private lastId=0;
 retryDetails(){if(this.lastId)this.openDetails({id:this.lastId} as Movie);}
 closeDetails(){this.modalOpen.set(false);this.detailRequest?.unsubscribe();this.selected.set(null);}
 private message(e:unknown){if(e instanceof HttpErrorResponse){if(e.status===0)return 'No se pudo conectar con el servidor. Comprueba que Spring Boot esté iniciado.';if(e.status===429)return 'Demasiadas solicitudes. Intenta de nuevo en unos momentos.';if(e.status===401||e.status===403)return 'No se pudo autorizar la consulta a TMDB. Revisa la configuración del backend.';if(e.status>=500)return 'El servicio no está disponible temporalmente.';}return 'Ocurrió un error al consultar las películas. Intenta nuevamente.';}
}
