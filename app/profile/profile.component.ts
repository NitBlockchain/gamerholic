import { ItemEventData } from "tns-core-modules/ui/list-view";
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
import { GameProvider } from '../services/game';
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

import { ios } from "application";
import * as geolocation from "nativescript-geolocation";
const localStorage = require("tns-core-modules/application-settings");
import * as utils from "tns-core-modules/utils/utils";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { confirm } from "tns-core-modules/ui/dialogs";
declare var UITableViewCellSelectionStyle;

@Component({
    selector: "Profile",
    moduleId: module.id,
    templateUrl: "./profile.component.html",
    styleUrls: ['./profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnInit {

    user: any
    token: any
    name: any
    profile: any

    $game: any
    chatIdentifier: any

    showChallenge: boolean
    showChat: boolean

    game: any
    amount: any
    rules: any
    console: any
    type: any

    DUSER: any

    constructor(
        private page: Page, private zone: NgZone, private cd: ChangeDetectorRef, public _game: GameProvider, private router: RouterExtensions, private route: ActivatedRoute,
    ) {
        this.$game = _game
        this.chatIdentifier = null
        this.showChat = false
        this.showChallenge = false
    }

    ngOnInit(): void {

        this.token = localStorage.getString('token')
        this.name = localStorage.getString('name')
        this.user = localStorage.getString('user')

        this.profile = this.route.snapshot.params.user

        this.gPROFILE()
    }

    async gPROFILE() {

        this.$game.gPROFILE(this.token, this.user, this.profile)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.DUSER = jordi.payload

                            console.log(this.DUSER)
                            this.cd.detectChanges();

                        })


                    } else {


                    }
                })
    }

    onChallenge() {

        this.zone.run(() => {

            dialogs.action({
                message: "What Game?",
                cancelButtonText: "cancel",
                actions: ["Madden Xbox", "NBA 2k Xbox", "FIFA Xbox", "Madden PS4", "NBA 2k PS4", "FIFA PS4"]
            }).then((game) => {

                this.game = game
                dialogs.action({
                    message: "Game Amount?",
                    cancelButtonText: "cancel",
                    actions: ["OWO", "$0 Practice", "$1 (btc)", "$2 (btc)", "$3 (btc)", "$5 (btc)", "$10 (btc)", "$15 (btc)", "$20 (btc)"]
                }).then((amount) => {

                    if (amount == 'OWO') {

                        dialogs.prompt({
                            title: "How many OWO",
                            message: "amount",
                            okButtonText: "next",
                            cancelButtonText: "Cancel",
                            defaultText: null,
                            inputType: dialogs.inputType.text
                        }).then((r) => {

                            if (r.text) {
                                this.amount = r.text
                                dialogs.prompt({
                                    title: this.game,
                                    message: "rules",
                                    okButtonText: "send it",
                                    cancelButtonText: "Cancel",
                                    defaultText: null,
                                    inputType: dialogs.inputType.text
                                }).then((r) => {

                                    if (r.text) {
                                        this.rules = r.text
                                        // this.onEditComplete(r.text, 1)
                                        this.sendChallenge(2)
                                        // console.log(r.text)

                                    } else {
                                        this.pop("rules can't  be blank", 'error')
                                    }

                                });

                            } else {
                                this.pop("rules can't  be blank", 'error')
                            }

                        });

                    } else {

                        this.amount = amount
                        dialogs.prompt({
                            title: this.game,
                            message: "rules",
                            okButtonText: "send it",
                            cancelButtonText: "Cancel",
                            defaultText: null,
                            inputType: dialogs.inputType.text
                        }).then((r) => {

                            if (r.text) {
                                this.rules = r.text
                                // this.onEditComplete(r.text, 1)
                                this.sendChallenge(0)
                                // console.log(r.text)

                            } else {
                                this.pop("rules can't  be blank", 'error')
                            }

                        });
                    }

                })


            });
            this.cd.detectChanges();

        })

    }

    async sendChallenge(type: any) {

        this.$game.sendChallenge(this.token, this.user, this.profile, this.game, this.amount, this.rules, type)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.pop("challenge sent", "success")
                        })


                    } else {

                        this.pop(jordi.message, "error")

                    }
                })
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

}
