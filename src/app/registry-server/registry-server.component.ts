import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegistryServer } from '../interface/registry-server';
import { RegistryKind } from '../interface/registry-kind.enum';
import { RegistryStatus } from '../interface/registry-status.enum';
import { FadeInAnimation } from '../_animations/index';
import { PubSubService } from '../service/pub-sub.service';
import { EVENT_MODAL_CONFIRM, EVENT_OPEN_MODAL } from '../utils';

@Component({
  selector: 'app-registry-server',
  templateUrl: './registry-server.component.html',
  styleUrls: ['./registry-server.component.scss'],
  animations: [FadeInAnimation],
  host: { '[@FadeInAnimation]': '' }
})
export class RegistryServerComponent implements OnInit {

  @Input() data: RegistryServer;
  onGoing: boolean = false;
  @Output() editServer: EventEmitter<RegistryServer> = new EventEmitter<RegistryServer>();
  @Output() deleteServer: EventEmitter<RegistryServer> = new EventEmitter<RegistryServer>();
  @Output() pingServer: EventEmitter<RegistryServer> = new EventEmitter<RegistryServer>();

  constructor(
    private pubSub: PubSubService
  ) {
    this.pubSub.on(EVENT_MODAL_CONFIRM).subscribe(data => {
      if (data && data.id && data.id === this.data.id) {
        this.delete();
      }
    });
  }

  ngOnInit() {
  }

  public get imgSrc(): string {
    if (this.data.kind === RegistryKind.HARBOR) {
      return "../images/harbor-logo.png"
    }

    return "";//not supported now
  }

  public get createTime(): string {
    if (this.data && this.data.create_time) {
      return this.convertTime(this.data.create_time);
    }

    let now: Date = new Date();
    return now.toLocaleString();
  }

  public get updateTime(): string {
    if (this.data && this.data.update_time) {
      return this.convertTime(this.data.update_time);
    }

    let now: Date = new Date();
    return now.toLocaleString();
  }

  public get isHealthy(): boolean {
    return this.data.status === RegistryStatus.HEALTHY;
  }

  public get progressClass(): string {
    if (this.onGoing) {
      return "loop";
    }

    if (this.isHealthy) {
      return "success";
    } else {
      return "danger";
    }
  }

  private convertTime(time: number): string {
    let dt: Date = new Date();
    dt.setTime(time * 1000);

    return dt.toLocaleString();
  }

  private confirmDeletion(): void {
    this.pubSub.publish(EVENT_OPEN_MODAL, {
      messageTitle: "CONFIRM TO DELETE?",
      message: "Confirm to delete registry server '" + this.data.name + "(" + this.data.id + ")'?",
      extraData: this.data
    });
  }

  edit(): void {
    this.editServer.emit(this.data);
  }

  delete(): void {
    this.deleteServer.emit(this.data);
  }

  ping(): void {
    this.pingServer.emit(this.data);
  }

}
