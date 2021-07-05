# NodeMaria
 이노뎁 MAM에 임의의 객체 정보를 웹소켓을 통해 삽입하기 위한 프로그램입니다.

## 특징
- 데이터 타입, 데이터 삽입 간격, 데이터 개수 등을 설정할 수 있습니다.
- MariaDB 또는 MongoDB에 원하는 데이터 개수를 입력하여 빠르게 저장할 수 있습니다. 이를 통해, 대량의 데이터가 저장된 환경에서 검색 속도를 측정할 수 있습니다.
- 웹소켓을 통해 MAM에게 데이터를 전달할 수 있습니다.

### 명령어 종류
- websocket [MAM IP] [MAS IP] [Insert Interval(ms)] [The number of records (default: infinity)]
- mariadb [DB IP] [DB name] [Insert Interval (ms)]
- mongodb [DB IP] [The number of data]
- mariadbcnt [DB IP] [The number of data]
- mariadbcntthread [DB IP] [The number of data] [The number of threads]
