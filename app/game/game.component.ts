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
    selector: "Game",
    moduleId: module.id,
    templateUrl: "./game.component.html",
    styleUrls: ['./game.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameComponent implements OnInit {

    user: any
    token: any
    name: any

    $game: any
    challenge: any

    DGAME: any

    constructor(
        private page: Page, private zone: NgZone, private cd: ChangeDetectorRef, public _game: GameProvider, private router: RouterExtensions, private route: ActivatedRoute,
    ) {
        this.$game = _game
    }

    ngOnInit(): void {

        this.token = localStorage.getString('token')
        this.name = localStorage.getString('name')
        this.user = localStorage.getString('user')

        this.challenge = this.route.snapshot.params.game

        this.gGAME()
    }

    async gGAME() {

        // this.DGAME = {
        //     "challenge": "1740ea1b-9533-461b-8724-feeb8afd58f3",
        //     "player1": "f37e7cc5-6f38-45af-9e3c-f77e5dad9e2c",
        //     "player2": "300eb677-06ce-4439-9177-de8a7f0c3488",
        //     "ref": "0",
        //     "details": {
        //         "game": "Madden Xbox",
        //         "rules": "no cheating",
        //         "amountUSD": "0",
        //         "amountBTC": 0,
        //         "amountFEE": 0,
        //         "p1Avatar": "~/assets/controller.png",
        //         "p2Avatar": "~/assets/controller.png",
        //         "p1": "kingsengbe",
        //         "p2": "owomahn",
        //         "p1txid": "free game",
        //         "p2txid": 0,
        //         "p2Accepted": 1,
        //         "p1score": 0,
        //         "p2score": 0,
        //         "scoredBy": "300eb677-06ce-4439-9177-de8a7f0c3488",
        //         "scoreDate": "2020-03-05T19:50:57.465Z",
        //         "scoreAccepted": 0,
        //         "payTxid": 0,
        //         "ref": 0,
        //         "refName": 0,
        //         "refAvatar": 0,
        //         "dispute": 0,
        //         "disputeReason": 0,
        //         "disputeEvidence": 0,
        //         "disputeResult": 0,
        //         "disputedEscalated": 0,
        //         "winner": "kingsengbe"
        //     },
        //     "date_created": "2020-03-05T08:29:23.810Z",
        //     "results": null,
        //     "active": 1,
        //     "won": 0,
        //     "disputes": null
        // }
        this.$game.gGAME(this.token, this.user, this.challenge)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.DGAME = jordi.payload

                            console.log(this.DGAME)
                            this.cd.detectChanges();

                        })


                    } else {


                    }
                })
    }
    async onCancel(player: any) {

        this.$game.cancelChallenge(this.token, this.user, this.challenge, player)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.pop("challenge canceled", "success")
                            setTimeout(() => {
                                this.gGAME()
                            }, 1000)
                        })


                    } else {

                        this.zone.run(() => {

                            this.pop(jordi.message, "error")
                        })
                    }
                })
    }
    s
    async onAccept() {

        this.$game.acceptChallenge(this.token, this.user, this.challenge)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.pop("challenge accepted", "success")
                            this.pop("challenge canceled", "success")
                            setTimeout(() => {
                                this.gGAME()
                            }, 1000)
                        })


                    } else {

                        this.zone.run(() => {

                            this.pop(jordi.message, "error")
                        })
                    }
                })
    }

    onScore() {

        this.zone.run(() => {

            dialogs.action({
                message: "Who Won?",
                cancelButtonText: "cancel",
                actions: [this.DGAME.details.p1, this.DGAME.details.p2]
            }).then((result) => {

                this.score(result)

            });
            this.cd.detectChanges();

        })

    }

    async score(winner) {

        this.$game.scoreChallenge(this.token, this.user, this.challenge, winner)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.pop("result updated, your opponent will confirm", "success")
                            this.pop("challenge canceled", "success")
                            setTimeout(() => {
                                this.gGAME()
                            }, 1000)
                        })

                    } else {

                        this.pop(jordi.message, "error")

                    }
                })
    }
    async scoreAccept(type: any) {

        ///1 = accpet  2 = reject
        console.log(type)
        this.$game.scoreAccept(this.token, this.user, this.challenge, type)
            .subscribe(
                (jordi: any) => {
                    if (jordi.success) {

                        this.zone.run(() => {

                            this.pop(jordi.message, "success")
                            this.pop("challenge canceled", "success")
                            setTimeout(() => {
                                this.gGAME()
                            }, 1000)
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
