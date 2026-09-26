<div align="center">

![free-icon-globe-6004805](https://github.com/user-attachments/assets/efb2e109-0406-4983-8dd2-8d345af8af0a)


### Eco Grow
[<img src="https://img.shields.io/badge/프로젝트 기간-2024.09.10~2024.11.27-green?style=flat&logo=&logoColor=white" />]()

</div> 

## 프로젝트 소개

- Software Capston Design
- 프로젝트명 : EcoGrow
- 내용 : 버리는 쓰레기를 시각화하고 사용자에게 맞춤형 쓰레기 감소 팁을 제공하며 제로웨이스트 제품을 추천하는 서비스

<br>


## 프로젝트 팀원

|리더|팀원|팀원|
|:---:|:---:|:---:|
|[김경민](https://github.com/gminnimk)|[서찬영](https://github.com/scy2000-lab)|[석연걸](https://github.com/SeokYeongeol)|

<br>

## 팀 역할

| 역할 | 김경민 | 서찬영 | 석연걸 |
| :---: | :---: | :---: | :---: |
| **담당 기능** | • 인증/인가(JWT)<br>• 소셜 로그인(Kakao, Google)<br>• 관리자 기능<br>• 쓰레기 기록 CRUD<br>• 맞춤형 쓰레기 감소 TIP<br>• 제로웨이스트 제품 추천 기능<br>• Front | • 회원가입 & 로그인 페이지<br>• 프로필<br>• 뉴스 API<br>• 실시간 채팅 | • 2D 이스터에그 게임<br>• 3D 분리수거 게임<br>• 기상청 API<br>• Front |

<br>


## 프로젝트 아키텍쳐

![image](https://github.com/user-attachments/assets/b6d4cb3d-0f80-400a-86ac-b3ec5a6dac06)

<br>

## APIs

[Notion API 명세서 바로가기](https://east-bacon-c1a.notion.site/148f8bbc8b2280318907cacfed82c9ba?v=148f8bbc8b2281dd8449000cfbd41051&pvs=4)

<br>

## ERD 다이어그램 

![image](https://github.com/user-attachments/assets/7803b2fc-fcb5-4955-a9be-0d12a3babbae)

<br>

## Tech Stacks

### ■ Back-end

<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Java.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringBoot.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringSecurity.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringDataJPA.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Mysql.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/JWT.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Qeurydsl.png?raw=true" width="80">
<img src="https://github.com/user-attachments/assets/7f8362fa-62b1-43d1-aea5-e048301d779c" width="80">
</div>

- JDK 17.0.11
- Dependencies
  - Spring Boot: data-jpa, data-jdbc, security, 유효성 검사, 웹, 테스트, devtools, oauth2-client, websocket, redis, cache
  - Lombok: compileOnly, AnnotationProcessor
  - MySQL 커넥터: RuntimeOnly
  - JWT: jjwt-api, jjwt-impl, jjwt-jackson(0.11.5)
  - QueryDSL: querydsl-jpa(5.0.0), querydsl-apt
  - MapStruct: mapstruct(1.5.5.Final)
  - Jsoup 1.13.1
  - session-data-redis 3.1.0

<br>

### ■ Front
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/React.png?raw=true?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/JavaScript.png?raw=true" width="80">
<img src="https://github.com/user-attachments/assets/7a3ce146-76cb-41c8-9a57-9ef24c369e04" width="80">

</div>

### ■ Game
<div>
<img src="https://github.com/user-attachments/assets/a011fb70-7e4a-4a9e-a023-38e5c13ee0f3" width="80">
<img src="https://github.com/user-attachments/assets/e2d71b42-0320-490a-acb5-bfe58aa79672" width="80">
</div>

<br>

### ■ Infra

<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Docker.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/AWSEC2.png?raw=true" width="80">
<img src="https://github.com/user-attachments/assets/86b95fde-3bd2-429e-9297-0b8e12a764a1" width="80">
</div>

<br>

### ■ Tools
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Github.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Notion.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Postman.png?raw=true" width="80">
</div>
          
<br><br>

## 성능 최적화

> **Scenario**: 공지사항 페이지 (목록 조회) 성능 테스트
> **Test Tools**: `nGrinder`, `Scouter`

### 1. JPA N+1 문제 해결 및 조회 API 성능 최적화

**1. 배경**
- 전체 조회 API에서 5,000개의 데이터를 한번에 보여주는 상황
- **문제 상황**: '폐기물 기록 전체 조회' API에서 심각한 성능 저하 현상 발생
    - `nGrinder`를 이용한 부하 테스트 결과, 초기 TPS(초당 처리량)가 **1.3**에 불과하여 대규모 트래픽 처리 및 서비스 확장성에 큰 제약이 있음을 확인

**2. 원인 분석**
- Hibernate가 발생시키는 SQL 로그 분석 결과, 목록 조회를 위한 기본 쿼리(1) 실행 후, 조회된 데이터 수(N)만큼 연관된 하위 엔티티(`User`, `Profile`, `WasteItem`)를 조회하는 추가 쿼리가 발생하는 **N+1 문제**임을 파악.
- 하나의 API 요청에 수백 개 이상의 불필요한 쿼리가 실행되어 DB와 애플리케이션에 과도한 부하를 유발하는 것이 근본 원인.

**3. 해결 과정 및 기술적 결정**
- **1단계: Fetch Join과 Batch Size를 이용한 N+1 완화**
    - **적용** :
        - `@ManyToOne`, `@OneToOne` 관계(User, Profile)에는 `Fetch Join`을 적용하여 즉시 로딩으로 쿼리 수 감소
        - `@OneToMany` 관계(WasteItems)에는 `@BatchSize`를 적용하여 지연 로딩 시 `IN` 절을 통한 일괄 처리로 N+1 쿼리 완화
    - **결과**: TPS가 **1.3에서 4.1로 약 3배 개선**되었으나 여전히 엔티티를 조회함에 따른 영속성 컨텍스트 관리 오버헤드와 불필요한 컬럼 조회 문제가 남아있음을 인지

- **2단계: DTO 직접 조회를 통한 근본적인 성능 최적화**
    - **전략**: 엔티티를 조회한 후 DTO로 변환하는 기존 방식에서 탈피, **QueryDSL의 `Projections`** 를 사용하여 조회 결과를 DTO로 직접 매핑하는 방식으로 리팩토링을 진행
    - **기술적 결정 이유**:
        - **`SELECT` 절 최적화**: SQL 레벨에서 API에 필요한 컬럼만 정확히 지정하여 조회함으로써 네트워크 트래픽과 DB 부하를 최소화. (기존에는 응답 DTO에서 ToMany 리스트를 호출)
        - **영속성 컨텍스트 부하 제거**: 엔티티를 거치지 않아 영속성 컨텍스트의 스냅샷 생성 및 변경 감지 오버헤드를 원천적으로 제거
        - **N+1 문제 구조적 차단**: DTO Projection 기반 조회로 엔티티 연관관계 접근을 제거하여 N+1 문제가 재발할 수 없는 구조로 전환

<br>

**4. 정량적 성과 (nGrinder 부하 테스트 결과)**

**기존 쿼리 발생 5000 이상 ⇒ 11 ⇒ 1 으로 최적화**

| 지표 | 최적화 이전 | 최종 최적화 이후 | 개선 효과 |
| --- | --- | --- | --- |
| **TPS (초당 처리량)** | 1.3 | **129.5** | **약 100배 향상** |
| **Peak TPS (최대 처리량)** | 5.0 | **142.5** | **약 28.5배 향상** |
| **Mean Test Time (평균 응답 시간)** | 7,435.77ms | **75.28ms** | **약 99% 감소** |
| **Executed Tests (총 처리 건수)** | 60 | 7,525 | **+12,442%** |


#### [ 기존 ]
  <img width="2048" height="608" alt="image" src="https://github.com/user-attachments/assets/308ee67e-a4aa-4f04-9986-be1421ac16a5" />


#### [ Fetch Join과 Batch Size를 이용한 N+1 완화 ]
  <img width="2048" height="637" alt="image" src="https://github.com/user-attachments/assets/27fde65c-5241-486c-8985-20efa2723f7c" />


#### [ QueryDSL DTO 프로젝션 적용 ]
  <img width="2048" height="619" alt="image" src="https://github.com/user-attachments/assets/71636dc9-5d85-4f16-b773-8bdd6db9ecd5" />


<br><br>

**[ 단계별 개선 요약 ]**
기존 ⇒ **Fetch Join과 Batch Size를 이용한 N+1 완화 ⇒ DTO 프로젝션 적용**
- **TPS**: 1.3 ⇒ 4.1 ⇒ **129.5**
- **Peak TPS**: 5.0 ⇒ 6.0 ⇒ **142.5**
- **Mean Test Time**: 7,435.77ms ⇒ 2,486.83ms ⇒ **75.28ms**
- **Executed Tests**: 60 ⇒ 230 ⇒ **7,525**

<br>

### 2. 인덱스 적용

**1. 배경**
- 폐기물 기록 리스트 조회 API에서 **생성일(created_at)을 기준으로 범위 조회 및 정렬**하는 요청이 빈번히 발생.
- 특정 기간(예: 일주일, 한 달 단위) 단위로 조회 시 **쿼리 실행 시간이 지연**되고 대량 요청 시 성능 저하 문제가 발생함을 확인.
- EXPLAIN 실행 결과 해당 쿼리가 **풀 테이블 스캔(Full Table Scan)**으로 동작하고 있음을 확인.
    
  <img width="1442" height="146" alt="image" src="https://github.com/user-attachments/assets/9de0880d-fd3c-43dd-864c-88fa4ae2ef72" />

<br>

**2. 원인 분석**
- `created_at` 컬럼에 적절한 인덱스가 없어 범위 검색 및 정렬 시 모든 레코드를 스캔해야 했음.
- 데이터가 수만 건 이상 누적됨에 따라 풀 스캔 비용이 급격히 증가하여 응답 시간이 지연됨.

**3. 해결 과정 및 기술적 결정**
- **1단계: 인덱스 생성**
    - `created_at` 컬럼에 단일 인덱스를 생성하여 범위 검색과 정렬 시 인덱스를 활용할 수 있도록 조치.
      ```sql
      CREATE INDEX idx_created ON waste_records (created_at);
      ```

- **2단계: 인덱스 활용 검증 (EXPLAIN, Profiling)**
    - EXPLAIN 실행 결과, 풀 테이블 스캔 → 인덱스 레인지 스캔으로 전환됨을 확인.
        
        ```sql
        EXPLAIN SELECT * FROM waste_records
        WHERE created_at BETWEEN '2024-10-10 00:00:00' AND '2024-10-12 23:59:59'
        ORDER BY created_at ASC;
        ```
      <img width="1448" height="140" alt="image" src="https://github.com/user-attachments/assets/81472448-894c-4d30-9517-6506ebe5716e" />
      <br>
        
    - MySQL Profiling을 통해 인덱스 적용 전, 후 실제 쿼리 실행 시간 비교:
    - **0.048816s → 0.002947s (약 94% 성능 개선)**
            
      <img width="770" height="748" alt="image" src="https://github.com/user-attachments/assets/fa51da17-b9fa-4cea-aa3c-8d09ba37b011" />
      <br>

- **3단계: 대량 요청 환경에서 부하 테스트**
    - `nGrinder` 및 `Scouter` 모니터링 툴을 활용하여 대량 요청 시 성능 개선 효과를 검증.
    - 단일 쿼리 실행 시 체감이 크지 않았으나, 동시 요청이 늘어날수록 **인덱스 활용 효과가 명확하게 나타남**.

<br>

**4. 정량적 성과 (nGrinder 부하 테스트 결과)**

| 지표 | 최적화 이전 | 최적화 이후 | 개선 효과 |
| --- | --- | --- | --- |
| **TPS (초당 처리량)** | 215.8 | **1,059.9** | **약 391% 향상** |
| **Peak TPS (최대 처리량)** | 235.5 | **1,200.0** | **약 410% 향상** |
| **Mean Test Time (평균 응답 시간)** | 41.41ms | **8.75ms** | **약 79% 단축** |
| **Executed Tests** | 12,553 | **59,497** | **약 374% 증가** |

#### [ 인덱스 적용 전 ]
  <img width="2048" height="625" alt="image" src="https://github.com/user-attachments/assets/199c6519-011c-4348-89fe-a317ceb6667b" />


#### [ 인덱스 적용 후 ]
  <img width="2048" height="613" alt="image" src="https://github.com/user-attachments/assets/357db61b-41ac-49bc-962e-ed78ad73a4ab" />

<br><br>

## 시연 영상

[Youtube 시연 영상 보기](https://youtu.be/-pMsN_q1SQI)

<br>

## 발표 PPT

[발표 자료 다운로드/보기](https://drive.google.com/file/d/1psZjJKXSQLjjCthlXXW2jidrHAc3shOY/view)

![image](https://github.com/user-attachments/assets/7058ff89-7d1e-4267-8529-961f09bf3652)

<br>

## 기술적 의사결정

<details>
  <summary>DataBase : MySQL</summary>
<br>

- 관계를 맺고 있는 데이터가 자주 수정되는 경우, MySQL의 관계형 데이터 모델과 트랜잭션 관리 기능은 데이터의 무결성과 일관성을 보장하는 데 유리합니다.
- 저희 프로젝트는 기획 당시 사용자 권한, 쓰레기 기록 하나에 세부 쓰레기 내역, 감소 팁 등 연관된 관계가 많다고 예상되어 복잡한 쿼리를 효율적으로 처리하기 유리한 MySQL 를 선택하게 되었습니다

<br>
</details>


<details>
  <summary>Front : React</summary>
<br>

- React의 컴포넌트 기반 구조는 UI를 작은 재사용 가능한 조각으로 분리하여 개발과 유지보수를 용이하게 만들어 재사용성과 가독성이 높은 코드작성이 가능합니다.
- 저희 프로젝트는 차트(Chart.js), 모달 등 시각적 UI를 위주로 하기 때문에 풍부한 라이브러리와 도구 지원을 제공하는 React를 선택하게 되었습니다.

<br>
</details>


<br>

## Trouble Shooting

<details>
  <summary>양방향 참조 문제</summary>

<br>

📢 WasteRecord 와 WasteItem 간의 양방향 참조 문제

➡️ **오류 내용**
- WasteRecord는 다시 WasteItem 리스트를 참조하면서 무한 순환 참조가 발생하여 JSON 직렬화 시 깊이 제한을 초과하는 문제가 발생
> `HttpMessageNotWritableException: Could not write JSON: Document nesting depth (1001) exceeds the maximum allowed`

➡️ **원인**
- **양방향 탐색**: WasteRecord를 직렬화할 때 wasteItems를 포함하고, 각 WasteItem은 다시 WasteRecord를 참조하여 무한 루프 발생

➡️ **해결 방법**
- **`@JsonIgnoreProperties` 사용**: 순환 참조를 방지하기 위해 직렬화 시 특정 필드 무시
- 또는 **`@JsonManagedReference` & `@JsonBackReference`** 사용: 부모-자식 관계를 명시하여 부모 측만 직렬화하고 자식 측 역참조 방지

<br>

</details>

<details>
  <summary>Spring Boot의 모호한 핸들러 매핑</summary>

<br>

📢 동일 URL 패턴에 대한 중복 매핑 이슈

➡️ **오류 내용**
> `java.lang.IllegalStateException: Ambiguous handler methods mapped for '/api/waste/record/3'`

➡️ **원인**
- `/api/waste/record/{id}` 경로에 대해 두 개의 컨트롤러 메서드가 매핑됨
    1. `getWasteRecord(@PathVariable Long RecordId)`: 단일 기록 조회
    2. `getWasteRecords(@PathVariable Long userId)`: 사용자별 기록 조회
- Spring이 요청을 어느 메서드로 처리할지 결정할 수 없음

➡️ **해결 방법**
- **API 경로 분리**:
    - 단일 기록 조회: `/api/waste/record/{recordId}` 유지
    - 사용자별 기록 조회: `/api/waste/record/user/{userId}`로 변경하여 명확히 구분

<br>
</details>

<details>
  <summary>특정 페이지 조회 시 Hibernate 무한 루프 이슈</summary>
<br>

📢 프론트엔드 조회 시 지속적인 API 호출 발생

➡️ **오류 내용**
- 서버 콘솔에서 Hibernate 쿼리가 끊임없이 반복 실행됨

➡️ **원인**
- React `useEffect`의 의존��� 배열에 `fetchAllRecords` 함수 자체가 포함됨
- 컴포넌트 렌더링 → 함수 재생성 → `useEffect` 트리거 → 상태 변경 → 재렌더링의 무한 루프 발생

➡️ **해결 방법**
- `useEffect`의 의존성 배열을 수정하여, 데이터 페칭이 필요한 시점(예: `currentPage` 변경 시)에만 실행되도록 조정

<br>
</details>
