export const convertDate= {
  methods: {
    convertTimeToDate(t) {

        var date = new Date(t);

        var hours_ = date.getHours();
        var minutes_ = "0" + date.getMinutes();
        var seconds_ = "0" + date.getSeconds();

        var date_ = '0' + date.getDate();
        var month_ = '0' + ( date.getMonth() + 1 );
        var year_ = date.getFullYear();

        var res =
          hours_ + ":" + minutes_.substr(-2) + ":" + seconds_.substr(-2) + " " +
          date_.slice(-2) + "-" + month_.slice(-2) + "-" + year_

      return res

    }
  }
}
