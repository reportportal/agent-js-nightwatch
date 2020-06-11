/*
 *  Copyright 2020 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { getLastItem } from '../utils';
import { StorageTestItem } from '../models';

export class Storage {
  private testItems: Array<StorageTestItem>;

  constructor(initialItems: Array<StorageTestItem> = []) {
    this.testItems = initialItems;
  }

  public getAllItems(): Array<StorageTestItem> {
    return this.testItems;
  }

  public getLastItem(): StorageTestItem {
    return getLastItem(this.testItems);
  }

  public getItemByName(itemName: string): StorageTestItem {
    const testItem = this.testItems.find((item) => item.name === itemName);

    return testItem || null;
  }

  public getItemById(id: string): StorageTestItem {
    const testItem = this.testItems.find((item) => item.id === id);

    return testItem || null;
  }

  public getCurrentItem(itemName: string): StorageTestItem {
    const itemByName = this.getItemByName(itemName);

    return itemByName || this.getLastItem();
  }

  public addTestItem(item: StorageTestItem): void {
    this.testItems.push(item);
  }

  public removeItemById(id: string): void {
    this.testItems = this.testItems.filter((item) => item.id !== id);
  }
}
