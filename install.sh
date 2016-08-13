#===============================================================
echo "verificando dependencias..."
#===============================================================
echo ">nodejs"
NODEJS=$(nodejs -v | grep v*.)
if [ "$NODEJS" = "" ];then
  echo "...........................instalando"
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  apt-get install -y nodejs
else
  echo "    version: $NODEJS"
fi
#===============================================================
echo ">snmp tools"
SNMP=$(snmpd -v | grep v*.[0-9])
if [ "$SNMP" = "" ];then
  echo "...........................instalando"
  apt-get install snmp snmpd snmp-mibs-downloader libperl-dev libsnmp-base
else
  echo "    $SNMP"
fi
#=================================================================
echo ">cortafuegos"
UFW=$(ufw --version | grep ufw[[:space:]][0-9].*)
if [ "$UFW" = "" ];then
  echo "...........................instalando"
  apt-get install ufw
  ufw enable
else
  echo "    $UFW"
  ufw enable
fi
#=================================================================
echo "Puertos..."
#=================================================================
echo ">Verificando puerto 161"
PORT161=$(ufw status verbose | grep 161)
if [ "$PORT161" = "" ];then
  echo "...........................Habilitando puerto 161"
  ufw allow 161
  ufw reload
else
  echo "    Puerto 161 habilitado"
fi
#=================================================================
echo ">Verificando puerto 162"
PORT162=$(ufw status verbose | grep 162)
if [ "$PORT162" = "" ];then
  echo "...........................Habilitando puerto 162"
  ufw allow 162
  ufw reload
else
  echo "    Puerto 162 habilitado"
fi

