---
theme: default
paginate: true
marp: true
---

<style>
h1, h2, h3 {
    text-align: center;
    color: blue
}
</style>

# Как испортить данные и как этого избежать. Введение в проблематику конкурентного доступа к данным.

---
## Игра в футбол. Первая итерация.

```typescript

class Play {

  private goalsCount: number = 0;

  private lastScoredTeam: Teams | null = null;

  public scoreGoal(team: Teams) {
    this.lastScoredTeam = team;
    this.goalsCount++;
  }
}

class Goal {
  
  constructor(
    private readonly id: string, 
    private readonly team: Teams) {}
}

```

---

```sql

SELECT COUNT(*) as goals FROM goal;

+-------+
| goals |
+-------+
|   169 |
+-------+

SELECT * FROM play;

+-------------+------------------+
| goals_count | last_scored_team |
+-------------+------------------+
|         164 | green            |
+-------------+------------------+

```
---

## Где голы!?

![Где голы?!](./travolta.jpg)


---

173 2xx responses, **3 non 2xx** responses

```sql

SELECT COUNT(*) as goals FROM goal;

+-------+
| goals |
+-------+
|   283 |
+-------+

SELECT * FROM play;

+-------------+------------------+--------------+
| goals_count | last_scored_team | data_version |
+-------------+------------------+--------------+
|         283 | green            |          284 |
+-------------+------------------+--------------+
```


