import { HttpErrorResponse, HttpInterceptorFn,HttpRequest,HttpHandlerFn,HttpEvent} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError,Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenApiModel } from '../Models/tokenapi.model';

export const tokenInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn):Observable<HttpEvent<unknown>> => {
  
 const auth = inject(AuthService);  
 const router = inject(Router);

 const token = auth.getToken();
 //console.log(token);

 if(token){
  req = req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  });
 }
 return next(req).pipe(
  catchError((err:unknown)=>{
    if(err instanceof HttpErrorResponse && err.status===401){
      return handle401Error(req,next,auth,router);
    }
    return throwError(() => err);
  })
 )
};

function handle401Error(req:HttpRequest<unknown>,next:HttpHandlerFn,auth:AuthService,router:Router):Observable<HttpEvent<unknown>>{
  const tokenApiModel = new TokenApiModel();
  tokenApiModel.accessToken = auth.getToken()!;
  tokenApiModel.refreshToken = auth.getrefreshtoken()!;

  return auth.renewtoken(tokenApiModel).pipe(
    switchMap((data:TokenApiModel)=>{
      auth.storeToken(data.accessToken);
      auth.storeRefreshtoken(data.refreshToken);

      const clonereq = req.clone({
        setHeaders:{
          Authorization:`Bearer ${data.accessToken}`
        }
      });
      return next(clonereq);
    }),
    catchError(()=>{
      router.navigate(['/login']);
      return throwError(() => new Error('Session expired'));
    })
  );
}