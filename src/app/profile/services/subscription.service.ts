import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { SubscriptionInterface } from '../types/follow.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  follow(data: SubscriptionInterface): Observable<SubscriptionInterface> {
    return this.http.post<SubscriptionInterface>(
      `${environment.nullableApiUrl}/subscriptions/follow`,
      data,
      { withCredentials: true }
    );
  }

  unfollow(data: SubscriptionInterface): Observable<SubscriptionInterface> {
    return this.http.post<SubscriptionInterface>(
      `${environment.nullableApiUrl}/subscriptions/unfollow`,
      data,
      { withCredentials: true }
    );
  }

  isFollowing(data: SubscriptionInterface) {
    return this.http.post(
      `${environment.nullableApiUrl}/subscriptions/is_following`,
      data,
      { withCredentials: true }
    );
  }
}
