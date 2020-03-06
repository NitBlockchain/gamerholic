
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/Rx';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// const poster = axios.create();
// poster.defaults.headers.post['Content-Type'] = 'application/json';

/*
  Generated class for the SessionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
    providedIn: 'root',
})
export class GameProvider {

    private server = "https://api.gamerholic.com";

    constructor(public http: HttpClient) {

    }

    ////guser
    gUSER(token: any, user: any, lat: any, lng: any) {
        let DATA = {
            token: token,
            user: user,
            lat: lat,
            lng: lng
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/gUSER', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    gPROFILE(token: any, user: any, profile: any) {
        let DATA = {
            token: token,
            user: user,
            profile: profile
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/gPROFILE', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    sendChallenge(token: any, user: any, opponent: any, game: any, amount: any, rules: any, type: any) {
        let DATA = {
            token: token,
            user: user,
            opponent: opponent,
            game: game,
            amount: amount,
            rules: rules,
            type: type
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/challenge', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }
    acceptChallenge(token: any, user: any, challenge: any) {
        let DATA = {
            token: token,
            user: user,
            challenge: challenge,
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/accept', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    scoreChallenge(token: any, user: any, challenge: any, winner: any) {
        let DATA = {
            token: token,
            user: user,
            challenge: challenge,
            winner: winner
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/score', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    scoreAccept(token: any, user: any, challenge: any, type: any) {
        let DATA = {
            token: token,
            user: user,
            challenge: challenge,
            type: type
        }
        console.log(type)
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/confirm', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    withdraw(token: any, user: any, amount: any, address: any, type: any) {
        let DATA = {
            token: token,
            user: user,
            amount: amount,
            address: address,
            type: type
        }
        console.log(type)
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/withdraw', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    gGAME(token: any, user: any, challenge: any) {
        let DATA = {
            token: token,
            user: user,
            challenge: challenge,
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/gGAME', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }
    cancelChallenge(token: any, user: any, challenge: any, player: any) {
        let DATA = {
            token: token,
            user: user,
            challenge: challenge,
            player: player
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/cancel', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    ////chat
    CHAT(token: any, user: any, message: any, id: any) {
        let DATA = {
            token: token,
            user: user,
            message: message,
            id: id
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/CHAT', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    onChat(token: any, user: any, message: any, id: any) {
        let DATA = {
            token: token,
            user: user,
            message: message,
            id: id
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/chat', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    gChat(token: any, user: any, id: any) {
        let DATA = {
            token: token,
            user: user,
            id: id
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/gchat', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    onEdit(token: any, user: any, text: any, type: any) {
        let DATA = {
            token: token,
            user: user,
            text: text,
            type: type
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/profile/edit', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    ////login
    login(number: string, device: string, lat: string, lng: string, country: string, deviceManufacturer, deviceModel, isIOS, isAndroid) {
        // console.log(device)
        let DATA = {
            number: number,
            device: device,
            lat: lat,
            lng: lng,
            country: country,
            deviceManufacturer: deviceManufacturer,
            deviceModel: deviceModel,
            isIOS: isIOS,
            isAndroid: isAndroid
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/login', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }

    loginComplete(code: string, device: string) {
        let DATA = {
            code: code,
            device: device,
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.server + '/loginComplete', DATA, httpOptions)
        // .map(this.extractData)
        // .catch(this.handleError);
    }


    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return headers;
    }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const err = error || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('error  is ' + JSON.stringify(errMsg));
        return observableThrowError(errMsg);
    }

}
