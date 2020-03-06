import { ItemEventData } from "tns-core-modules/ui/list-view";
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
import { GameProvider } from '../services/game';
import { RouterExtensions } from "nativescript-angular/router";

import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
import { getText, setText, getTextSync, setTextSync } from "nativescript-clipboard";
import { ios } from "application";
import * as geolocation from "nativescript-geolocation";
const localStorage = require("tns-core-modules/application-settings");
import * as utils from "tns-core-modules/utils/utils";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { confirm } from "tns-core-modules/ui/dialogs";
declare var UITableViewCellSelectionStyle;

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})


export class HomeComponent implements OnInit {

    token: string
    user: string
    name: string
    lat: string
    lng: string
    message: string
    tab: number
    chatIdentifier: string

    DLOCATION: any
    DUSER: any
    DGAMES: any
    DSTORE: any
    DHISTORY: any
    DACTIVEGAME: any
    DCHAT: any

    device: any
    deviceModel: any
    deviceManufacturer: any
    isIOS: boolean
    isAndroid: boolean
    admin: any
    country: any

    $game: any
    showBTCQR: any
    showOWOQR: any
    withdrawAmount: any
    withdrawAddress: any

    constructor(
        private page: Page, private zone: NgZone, private cd: ChangeDetectorRef, public _game: GameProvider, private router: RouterExtensions,
    ) {
        this.$game = _game
        this.chatIdentifier = null
        this.page.actionBarHidden = false;
        this.showBTCQR = false
        this.showOWOQR = false
        this.tab = 0
    }

    ngOnInit(): void {

        this.geo()
        this.token = localStorage.getString('token')
        this.name = localStorage.getString('name')
        this.user = localStorage.getString('user')
        this.lat = localStorage.getString('lat')
        this.lng = localStorage.getString('lng')

        this.device = device.uuid
        this.deviceManufacturer = device.manufacturer
        this.deviceModel = device.model
        this.country = device.region
        this.isAndroid = isAndroid
        this.isIOS = isIOS
        if (this.user) {
            this.gUSER()
        }
        //this.doLogin('mafef')
    }

    gUSER() {

        this.$game.gUSER(this.token, this.user)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.DUSER = jordi.payload[0]
                            this.DACTIVEGAME = jordi.payload[1]

                            // console.log(this.DUSER)
                            this.cd.detectChanges();

                        })


                    } else {


                    }
                })

    }

    CHAT(message: any) {

        if (!this.DUSER.profile.name) {
            this.pop('complete your profile to chat', 'error')
            setTimeout(() => {
                this.onEdit()
            }, 2000)
        } else if (message) {

            this.$game.onChat(this.token, this.user, message, null)
                .subscribe(
                    (jordi: any) => {

                        if (jordi.success) {
                            this.message = ''
                            this.gCHAT(this.chatIdentifier)
                        }

                    })
        }

    }

    gCHAT(identifier: any) {
        console.log("getting chats")
        this.$game.gChat(this.token, this.user, identifier)
            .subscribe(
                (jordi: any) => {

                    this.zone.run(() => {

                        this.DCHAT = jordi.payload.messages

                        // console.log(this.DCHAT)
                        this.cd.detectChanges();

                    })
                })
    }

    async onProfile(user: any) {

        setTimeout(() => {

            this.router.navigate(['/profile/' + user], {
                animated: true,
                clearHistory: false
            })
        }, 300);
    }
    async onGame(game: any) {

        setTimeout(() => {

            this.router.navigate(['/game/' + game], {
                animated: true,
                clearHistory: false
            })
        }, 300);
    }
    async onEdit() {

        dialogs.action({
            message: "Edit Profile",
            cancelButtonText: "cancel",
            actions: ["edit user name", "edit email"]
        }).then((result) => {
            // console.log("Dialog result: " + result);
            if (result == "edit user name") {

                dialogs.prompt({
                    title: "Edit User Name",
                    message: "choose a suitable user name",
                    okButtonText: "save",
                    cancelButtonText: "Cancel",
                    defaultText: null,
                    inputType: dialogs.inputType.text
                }).then((r) => {

                    if (r.result) {
                        this.onEditComplete(r.text, 1)

                    }

                });

            } else if (result == "edit email") {
                //Do action2
                dialogs.prompt({
                    title: "Edit Email",
                    message: "a confirmation code will be sent to your email address",
                    okButtonText: "save",
                    cancelButtonText: "Cancel",
                    defaultText: null,
                    inputType: dialogs.inputType.text
                }).then((r) => {
                    if (r.result) {
                        this.onEditComplete(r.text, 2)

                    }

                });
            }
        });

    }

    onEditComplete(text: string, type: number) {

        this.$game.onEdit(this.token, this.user, text, type)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {
                            this.pop(jordi.message, 'success')

                            this.gUSER()
                            this.cd.detectChanges();

                        })

                    } else {

                        this.pop(jordi.message, 'error')
                    }

                })
    }

    LOGIN() {

        dialogs.prompt({
            title: "Login/Signup",
            message: "register or login securely  via email, enter your email address",
            okButtonText: "send email",
            cancelButtonText: "cancel",
            inputType: dialogs.inputType.email
        }).then((r) => {
            if (r.text) {

                this.doLogin(r.text)

            } else {

            }
            // console.log("Dialog result: " + r.result + ", text: " + r.text);

        });
    }

    doLogin(email: string) {

        this.zone.run(() => {

            this.$game.login(email, this.device, this.lat, this.lng, this.country, this.deviceManufacturer, this.deviceModel, isIOS, isAndroid)
                .subscribe(
                    (jordi: any) => {
                        if (jordi.success) {

                            this.zone.run(() => {

                                dialogs.prompt({
                                    title: "verify account",
                                    message: "enter your login code",
                                    okButtonText: "log me in",
                                    cancelButtonText: "cancel",
                                    inputType: dialogs.inputType.text
                                }).then((r) => {
                                    if (r.text) {

                                        this.loginComplete(r.text)

                                    } else {
                                        this.pop('what is  your email address?', 'error')
                                    }
                                    // console.log("Dialog result: " + r.result + ", text: " + r.text);

                                });

                                this.cd.detectChanges();


                            })

                        } else {
                            this.pop(jordi.message, 'error')

                        }
                    })

            // this.DUSER = {
            //     name: "owomahn",
            //     wins: "0",
            //     loss: "0",
            //     game: "NBA 2k",
            //     avatar: "https://store.playstation.com/store/api/chihiro/00_09_000/container/IS/en/999/EP4476-CUSA11273_00-AV00000000000026/1576114130000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000"
            // }

            //this.DHISTORY = {}

        })
        this.cd.detectChanges();
    }

    loginComplete(code: string) {

        this.$game.loginComplete(code, this.device)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.token = jordi.token
                            this.user = jordi.user
                            localStorage.setString('token', jordi.token)
                            localStorage.setString('user', jordi.user)
                            this.pop("you are logged in", "success")
                            this.gUSER()
                        });

                        this.cd.detectChanges();


                    } else {

                        this.pop(jordi.message, "error")
                        setTimeout(() => {

                            this.zone.run(() => {

                                dialogs.prompt({
                                    title: "verify account",
                                    message: "enter your login code",
                                    okButtonText: "log me in",
                                    cancelButtonText: "cancel",
                                    inputType: dialogs.inputType.text
                                }).then((r) => {
                                    if (r.text) {

                                        this.loginComplete(r.text)

                                    } else {
                                        this.pop('what is  your email address?', 'error')
                                    }
                                    // console.log("Dialog result: " + r.result + ", text: " + r.text);

                                });

                                this.cd.detectChanges();


                            })
                        }, 2000)

                    }
                })
    }
    geo() {

        this.zone.run(() => {

            geolocation.isEnabled().then((isEnabled) => {
                if (!isEnabled) {
                    geolocation.enableLocationRequest(true, true).then(() => {
                        console.log("User Enabled Location Service");
                    }, (e) => {
                        this.pop(e.message, 'error')

                        console.log("Error: " + (e.message || e));
                    }).catch(ex => {

                        console.log("Unable to Enable Your Device Location", ex);
                    });
                } else {
                    // console.log("enabled")
                    this.bGeo()

                }
            }, (e) => {

            });

            this.cd.detectChanges();

        })

    }

    onWithdraw(type: any) {
        this.zone.run(() => {
            let title;
            let sendTo;
            if (type == 1) {
                title = "withdraw bitcoin"
                sendTo = "bitcoin address"
            } else {
                title = "withdraw owo"
                sendTo = "owo address"

            }
            dialogs.prompt({
                title: title,
                message: "amount",
                okButtonText: "next",
                cancelButtonText: "cancel",
                inputType: dialogs.inputType.text
            }).then((r) => {
                if (r.text) {
                    this.withdrawAmount = r.text
                    dialogs.prompt({
                        title: sendTo,
                        message: "address",
                        okButtonText: "withdraw",
                        cancelButtonText: "cancel",
                        inputType: dialogs.inputType.text
                    }).then((r) => {
                        if (r.text) {
                            this.withdrawAddress = r.text
                            this.completeWithdraw(type)

                        } else {
                            this.pop('what is  your withdraw address?', 'error')
                        }
                    });


                } else {
                    this.pop('whats the amount?', 'error')
                }
                // console.log("Dialog result: " + r.result + ", text: " + r.text);

            });

            this.cd.detectChanges();


        })
    }

    completeWithdraw(type: any) {

        this.$game.withdraw(this.token, this.user, this.withdrawAmount, this.withdrawAddress, type)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.pop(jordi.message, 'success')

                    } else {
                        this.pop(jordi.message, 'error')

                    }
                })

    }
    bGeo() {

        this.zone.run(() => {

            // console.log("bGeo  reached")
            geolocation.getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                maximumAge: 5000,
                timeout: 10000,
                iosAllowsBackgroundLocationUpdates: true
            }).then((loc: any) => {
                if (loc) {

                    this.lat = loc.latitude
                    this.lng = loc.longitude
                    localStorage.setString('lat', JSON.stringify(this.lat))
                    localStorage.setString('lng', JSON.stringify(this.lng))
                    // console.log(loc)
                } else {


                }
            }, (e) => {

                // this.pop('unable to get your location, local games won\'t be available', 'errors')

            });
            this.cd.detectChanges();

        })

    }
    public onCopy(text: any): void {
        setText(text)
            .then(() => this.pop("copied  to  clipboard", 'success'))
            .catch((err: string) => this.pop("error copying, try again", 'error'));
    }
    pop(message: any, type: any) {

        let options = {
            title: type,
            message: message,
            okButtonText: "OK"
        };

        confirm(options).then(() => {
            // console.log("Race chosen!");
        });
    }

    onItemLoading(args: any) {
        if (ios) {
            const cell = args.ios;
            cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        }
    }

    tabSelected(args: number) {
        this.tab = args
        if (this.tab == 0) {
            this.gUSER()
        } else if (this.tab == 1) {
            this.gCHAT(this.chatIdentifier)
        }
        console.log("tab selected: " + args);
    }
}
