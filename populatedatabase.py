#!flask/bin/python
# -*- coding: UTF-8 -*-

from app import db, models
import datetime
from random import randint, randrange

# noinspection PyArgumentList
user = models.User(name="Martin",
                   familyname="Solveig",
                   title="Mr",
                   company="NA",
                   position="IPD",
                   province="Gauteng",
                   gender2="Male",
                   postalad="22 yorkshire ave\nCalifornia",
                   email="liezl@peopledev.co.za",
                   password="test",
                   userident="rolkien",
                   userlevel="2",
                   highestqualification="BA Arts",
                   highesteducation="NA",
                   highestschooling="Matric",
                   activated="1",
                   pmobile="0826547895",
                   pfax="",
                   ptel="",
                   detailscompleted=0)

# noinspection PyArgumentList
user2 = models.User(name="Daimon",
	title="Mr",
	familyname="Sewell",
	company="University of Pretoria",
	position="Student",
	province="Gauteng",
	gender2="Male",
	postalad="NA",
	email="daimonsewell@gmail.com",
	password="Pa55word",
	userident="987654321",
	userlevel="1",
	highestqualification="NA",
	highesteducation="NA",
	highestschooling="Matric",
	activated="1",
	pmobile="0724855478",
	pfax="",
	ptel="",
	detailscompleted=0)

# noinspection PyArgumentList
Adminuser = models.User(name="John Wayne",
	title="",
	familyname="",
	company="",
	position="",
	province="",
	gender2="Female",
	postalad="",
	#email="liezl@peopledev.co.za",
	email="daimonsewell@gmail.com",
	password="Pa55word",
	userident="123456789",
	userlevel="0",
	highestqualification="",
	highesteducation="",
	highestschooling="",
	activated="1",
	pmobile="",
	pfax="",
	ptel="",
	time=datetime.datetime.now(),
	detailscompleted=0)

for i in range(10):
	# noinspection PyArgumentList
	user = models.User(name="Martin{}".format(i),
	                   title="Mr",
	                   familyname="Solveig",
	                   company="NA",
	                   position="IPD",
	                   province="Gauteng",
	                   gender2="Male",
	                   postalad="22 yorkshire ave\nCalifornia",
	                   email="liezl@peopledev.co.za",
	                   password="test",
	                   userident="rolkien{}".format(i),
	                   userlevel="2",
	                   highestqualification="BA Arts",
	                   highesteducation="NA",
	                   highestschooling="Matric",
	                   activated="1",
	                   pmobile="0826547895",
	                   pfax="",
	                   ptel="",
	                   detailscompleted=0)
	db.session.add(user)
db.session.commit()
db.session.add(user2)
db.session.add(Adminuser)
db.session.commit()



us = []
us.append(models.UnitStandard(uscode="7389",name="Help learners with language and literacies across the curriculum."))
us.append(models.UnitStandard(uscode="7468",name="Use mathematics to investigate and monitor the financial aspects of personal, business, national and international issues."))
us.append(models.UnitStandard(uscode="7975",name="Verify Moderation of Assessment"))
us.append(models.UnitStandard(uscode="7976",name="Design and Develop Assessments"))
us.append(models.UnitStandard(uscode="7977",name="Moderate Assessment"))
us.append(models.UnitStandard(uscode="7978",name="Plan and conduct assessment of learning outcomes"))
us.append(models.UnitStandard(uscode="9015",name="Apply knowledge of statistics and probability to critically interrogate and effectively communicate findings on life related problems."))
us.append(models.UnitStandard(uscode="9016",name="Represent, analyse and calculate shape and motion in 2-and 3-dimensional space in different contexts."))
us.append(models.UnitStandard(uscode="9926",name="Coach learners"))
us.append(models.UnitStandard(uscode="9930",name="Manage a quality assurance system"))
us.append(models.UnitStandard(uscode="9931",name="Advise and refer learners"))
us.append(models.UnitStandard(uscode="9932",name="Guide and support learners"))
us.append(models.UnitStandard(uscode="9935",name="Manage a learnership/learning programme"))
us.append(models.UnitStandard(uscode="9938",name="Evaluate learning programmes"))
us.append(models.UnitStandard(uscode="9941",name="Design and conduct research"))
us.append(models.UnitStandard(uscode="9944",name="Engage in occupational development"))
us.append(models.UnitStandard(uscode="9946",name="Develop workplace skills plan(s)"))
us.append(models.UnitStandard(uscode="9947",name="Implement workplace skills plan(s)"))
us.append(models.UnitStandard(uscode="9948",name="Design a quality assurance system"))
us.append(models.UnitStandard(uscode="9949",name="Compile report on workplace skills plan(s)"))
us.append(models.UnitStandard(uscode="9951",name="Plan a learning programme"))
us.append(models.UnitStandard(uscode="9954",name="Develop training materials"))
us.append(models.UnitStandard(uscode="9957",name="Facilitate learning using a variety of methodologies"))
us.append(models.UnitStandard(uscode="10146",name="Supervise a project team of a developmental project to deliver project objectives "))
us.append(models.UnitStandard(uscode="10294",name="Identify and respond to learners with special needs and barriers to learning "))
us.append(models.UnitStandard(uscode="10305",name="Devise interventions for learners who have special needs "))
us.append(models.UnitStandard(uscode="11473",name="Manage individual and team performance"))
us.append(models.UnitStandard(uscode="12544",name="Facilitate the preparation and presentation of evidence for assessment"))
us.append(models.UnitStandard(uscode="15191",name="Evaluate ETD providers."))
us.append(models.UnitStandard(uscode="15217",name="Develop an organisational training and development plan "))
us.append(models.UnitStandard(uscode="15218",name="Conduct an analysis to determine outcomes of learning for skills development and other purposes"))
us.append(models.UnitStandard(uscode="15221",name="Provide information and advice regarding skills development and related issues "))
us.append(models.UnitStandard(uscode="15222",name="Promote a learning culture in an organisation "))
us.append(models.UnitStandard(uscode="15224",name="Empower team members through recognising strengths, encouraging participation in decision making and delegating tasks "))
us.append(models.UnitStandard(uscode="15227",name="Conduct skills development administration in an organisation. "))
us.append(models.UnitStandard(uscode="15228",name="Advise on the establishment and implementation of a quality management system for skills development practices in an organisation"))
us.append(models.UnitStandard(uscode="15232",name="Coordinate planned skills development interventions in an organisation "))
us.append(models.UnitStandard(uscode="15233",name="Harness diversity and build on strengths of a diverse working environment "))
us.append(models.UnitStandard(uscode="15237",name="Build teams to meet set goals and objectives "))
us.append(models.UnitStandard(uscode="114226",name="Interpret and manage conflicts within the workplace."))
us.append(models.UnitStandard(uscode="114878",name="Identify and measure the factors that influence productivity. "))
us.append(models.UnitStandard(uscode="114922",name="Provide guidance on strategic governance of NQF implementation by providers."))
us.append(models.UnitStandard(uscode="114924",name="Demonstrate understanding of the outcomes-based education and training approach within the context of a National Qualifications Framework "))
us.append(models.UnitStandard(uscode="114925",name="Manage learner information using an information management system"))
us.append(models.UnitStandard(uscode="114926",name="Develop plans for implementing learnerships &amp; skills programs in a learning org."))
us.append(models.UnitStandard(uscode="115753",name="Conduct outcomes-based assessment "))
us.append(models.UnitStandard(uscode="115755",name="Design and develop outcomes-based assessments"))
us.append(models.UnitStandard(uscode="115759",name="Conduct moderation of outcomes-based assessments "))
us.append(models.UnitStandard(uscode="115789",name="Sustain oral interaction across a wide range of contexts and critically evaluate spoken texts "))
us.append(models.UnitStandard(uscode="115790",name="Write & present for a wide range of purposes, audiences & contexts."))
us.append(models.UnitStandard(uscode="115791",name=" Use language and communication strategies for vocational and occupational learning. "))
us.append(models.UnitStandard(uscode="115792",name="Write and present for a wide range of purposes, audiences and contexts "))
us.append(models.UnitStandard(uscode="116587",name="Develop, support and promote RPL practices."))
us.append(models.UnitStandard(uscode="116810",name="Manage assessment in a learning organisation."))
us.append(models.UnitStandard(uscode="116811",name="Manage learning at an education, training &amp; development provider."))
us.append(models.UnitStandard(uscode="117856",name="Define standards for assessment, education, training, and development "))
us.append(models.UnitStandard(uscode="117858",name="Design and develop qualifications for assessment, education, training and development "))
us.append(models.UnitStandard(uscode="117861",name="Evaluate compliance of standards &amp; qualifications with quality criteria."))
us.append(models.UnitStandard(uscode="117864",name="Advise and counsel learners."))
us.append(models.UnitStandard(uscode="117865",name="Assist and support learners to manage their learning experiences."))
us.append(models.UnitStandard(uscode="117870",name="Conduct targeted training and development using given methodologies."))
us.append(models.UnitStandard(uscode="117871",name=" Facilitate learning using a variety of given methodologies "))
us.append(models.UnitStandard(uscode="117874",name="Guide learners about their learning, assessment and recognition opportunities "))
us.append(models.UnitStandard(uscode="117877",name="Perform one-to-one training on the job "))
us.append(models.UnitStandard(uscode="119459",name="Write/present/sign for a wide range of contexts."))
us.append(models.UnitStandard(uscode="119462",name="Engage in sustained oral/signed communication and evaluate spoken/signed texts."))
us.append(models.UnitStandard(uscode="119469",name="Read/view, analyse and respond to a variety of texts."))
us.append(models.UnitStandard(uscode="119471",name="Use language and communication in occupational learning programmes."))
us.append(models.UnitStandard(uscode="119661",name="Demonstrate knowledge of the foundations of human rights and democracy"))
us.append(models.UnitStandard(uscode="123391",name="Develop ETD policies and procedures for an organisation."))
us.append(models.UnitStandard(uscode="123392",name="Design &amp; develop instruments to evaluate ETD."))
us.append(models.UnitStandard(uscode="123393",name="Carry out course administration "))
us.append(models.UnitStandard(uscode="123394",name="Develop outcomes-based learning programmes "))
us.append(models.UnitStandard(uscode="123395",name="Facilitate in complex situations to create learning and growth."))
us.append(models.UnitStandard(uscode="123396",name="Define target audience profiles and skills gaps "))
us.append(models.UnitStandard(uscode="123397",name="Evaluate a learning intervention using given evaluation instruments "))
us.append(models.UnitStandard(uscode="123398",name="Facilitate the transfer and application of learning in the workplace "))
us.append(models.UnitStandard(uscode="123399",name="Plan and develop an organisational learning framework"))
us.append(models.UnitStandard(uscode="123400",name="Evaluate &amp; promote ETD providers, services &amp; products for organisational use."))
us.append(models.UnitStandard(uscode="123401",name="Design outcomes-based learning programmes"))
for s in us:
	db.session.add(s)
db.session.commit()

quals = []
quals.append(models.Qualification(name="OD - ETDP Level 4 Certificate"))
quals.append(models.Qualification(name="OD - ETDP Level 5 Certificate"))
quals.append(models.Qualification(name="OD - ETDP Level 5 Diploma"))
quals.append(models.Qualification(name="OD - ETDP Level 6 Certificate"))
for s in quals:
	db.session.add(s)
db.session.commit()

mods = []
mods.append(models.Module(name="OD - ETDP Level 5 Certificate",					qualid=-1,roleid=-1,duration="12 months",	category="Q",   active=0,lpprice="28000",      assprice="10000"))
mods.append(models.Module(name="Module 1 - Training & Quality Management",			qualid=-1,roleid=-1,duration="5 + 1 days",	category="M",   active=1,lpprice="6100",       assprice="1300"))
mods.append(models.Module(name="Module 2 - Skills Planning & the SDF",				qualid=-1,roleid=-1,duration="5 + 1 days",	category="M",   active=1,lpprice="6100",       assprice="1300"))
mods.append(models.Module(name="Module 3 - Assessment, Moderation & Evaluation",		qualid=-1,roleid=-1,duration="5 + 1 days",	category="M",   active=1,lpprice="6100",       assprice="1300"))
mods.append(models.Module(name="Module 4 - Learning Program Design & Materials Development",	qualid=-1,roleid=-1,duration="5 + 1 days",	category="M",   active=1,lpprice="6100",       assprice="1300"))
mods.append(models.Module(name="Module 5 - Facilitation, Coaching & Mentoring",			qualid=-1,roleid=-1,duration="5 + 1 days",	category="M",   active=1,lpprice="6100",       assprice="1300"))
mods.append(models.Module(name="Skills Development Facilitator",				qualid=-1,roleid=-1,duration="3 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="1200"))
mods.append(models.Module(name="NQF Assessor",				                        qualid=-1,roleid=-1,duration="2 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="NQF Moderator",				                        qualid=-1,roleid=-1,duration="2 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="Designing Assessing Policies, Instruments & Guides",		qualid=-1,roleid=-1,duration="2 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="Train the Trainer",				                qualid=-1,roleid=-1,duration="2 + 1 days",	category="M",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="ERROR: Filler in Module table.",				qualid=-1,roleid=-1,duration="",	        category="",    active=0,lpprice="",           assprice=""))
mods.append(models.Module(name="Mentoring",				                        qualid=-1,roleid=-1,duration="2 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="The Learner Coach",				                qualid=-1,roleid=-1,duration="2 + 1 days",	category="P",   active=1,lpprice="3650",       assprice="950"))
mods.append(models.Module(name="RPL for OD-ETDP qualification",				        qualid=-1,roleid=-1,duration="1 + 1 day",	category="R",   active=1,lpprice="0",          assprice="7600"))
mods.append(models.Module(name="OD - ETDP Level 4 Certificate",				        qualid=-1,roleid=-1,duration="6 months",	category="Q",   active=0,lpprice="6100",       assprice="1900"))
mods.append(models.Module(name="OD - ETDP Level 5 Diploma",				        qualid=-1,roleid=-1,duration="12 months",	category="Q",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="ETD Coordination and Administration",				qualid=2, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Learning and RPL Advising",				        qualid=2, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Qualifications Standards and Curriculum Development",		qualid=3, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="ETD Management and Quality Management",				qualid=3, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Engaging in and Promoting Assessment Practices",		qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Defining and Evaluating Standards and Qualifications",		qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Facilitating Learning in Routine and Complex Situations",	qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Analyzing Needs and Planning and Developing Learning",		qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Facilitate and Manage Skills Development",			qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Evaluating HRD Interventions",				        qualid=4, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="OD - ETDP Level 6 Certificate",				        qualid=-1,roleid=-1,duration="",		category="Q",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Needs Analysis and Skills Planning",				qualid=1, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Learning Programme Design and Materials Development",		qualid=1, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Facilitation Coaching and Mentoring",				qualid=1, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
mods.append(models.Module(name="Assessment Moderation and Evaluation",				qualid=1, roleid=-1,duration="",		category="M",   active=0,lpprice="0",          assprice="0"))
for s in mods:
	db.session.add(s)
db.session.commit()

roles = []
roles.append(models.Role(name="Skills Development Facilitator",enabled=0))
roles.append(models.Role(name="Facilitator / Instructor / Lecturer / Trainer",enabled=0))
roles.append(models.Role(name="Assessor / Moderator",enabled=0))
roles.append(models.Role(name="Learner Guidance & Support Officer",enabled=0))
roles.append(models.Role(name="ETD Management & Administration",enabled=0))
roles.append(models.Role(name="ETD Quality Assurance",enabled=0))
roles.append(models.Role(name="Programme Developer",enabled=0))
roles.append(models.Role(name="ERROR: Role table placeholder",enabled=0))
roles.append(models.Role(name="Instrument Designer",enabled=0))
roles.append(models.Role(name="ETD Management, Quality Management, ETD Coordination & Administration",enabled=1))
roles.append(models.Role(name="Needs Analyses, Skills Planning & the SDF",enabled=1))
roles.append(models.Role(name="Assessment, Moderation & Evaluation",enabled=1))
roles.append(models.Role(name="Qualifications, Curricula, Learning Programme Design & Materials Development",enabled=1))
roles.append(models.Role(name="Facilitation, Coaching, Mentoring & Learner Support",enabled=1))
for s in roles:
	db.session.add(s)
db.session.commit()

# Map UnitStandards to Modules
mapo = []
mapo.append([2,9948])
mapo.append([2,9935])
mapo.append([2,9930])
mapo.append([3,9949])
mapo.append([3,9946])
mapo.append([3,9947])
mapo.append([4,7976])
mapo.append([4,9938])
mapo.append([4,7977])
mapo.append([4,7978])
mapo.append([4,7975])
mapo.append([5,9954])
mapo.append([5,9951])
mapo.append([6,9931])
mapo.append([6,9926])
mapo.append([6,9941])
mapo.append([6,9957])
mapo.append([6,9932])
mapo.append([7,9949])
mapo.append([7,9946])
mapo.append([7,9947])
mapo.append([8,7978])
mapo.append([9,7977])
mapo.append([10,7976])
mapo.append([11,117870])
mapo.append([11,119661])
mapo.append([11,7976])
mapo.append([11,9938])
mapo.append([11,7977])
mapo.append([11,117877])
mapo.append([11,7978])
mapo.append([13,9931])
mapo.append([13,9926])
mapo.append([13,9932])
mapo.append([14,9926])
mapo.append([14,7975])
mapo.append([18,123393])
mapo.append([18,15227])
mapo.append([19,12544])
mapo.append([19,7389])
mapo.append([20,15218])
mapo.append([20,117856])
mapo.append([20,117858])
mapo.append([21,15228])
mapo.append([21,15237])
mapo.append([21,15224])
mapo.append([21,15233])
mapo.append([21,114226])
mapo.append([21,114925])
mapo.append([22,116587])
mapo.append([22,116810])
mapo.append([23,117861])
mapo.append([24,117864])
mapo.append([24,123395])
mapo.append([25,123399])
mapo.append([26,114926])
mapo.append([26,116811])
mapo.append([26,114922])
mapo.append([27,123392])
mapo.append([27,123391])
mapo.append([27,123400])
mapo.append([27,15191])
mapo.append([27,10146])
mapo.append([29,15232])
mapo.append([29,123396])
mapo.append([29,15217])
mapo.append([29,15222])
mapo.append([29,15221])
mapo.append([30,114924])
mapo.append([30,123401])
mapo.append([30,123394])
mapo.append([30,10305])
mapo.append([31,117871])
mapo.append([31,117865])
mapo.append([31,123398])
mapo.append([31,117874])
mapo.append([31,10294])
mapo.append([32,115759])
mapo.append([32,115753])
mapo.append([32,115755])
mapo.append([32,123397])
for m in mapo:
	lpcode = m[0]
	uscode = m[1]
	lp = models.Module.query.filter_by(id=lpcode).first()
	us = models.UnitStandard.query.filter_by(uscode=str(uscode)).first()
	if lp is not None and us is not None:
		lxu = models.ModulexUS(usid=us.id,moduleid=lp.id)
		print("LPCODE({}) LPDESC({}) USCODE({}) USDESC({})".format(lp.id,lp.name,us.uscode,us.name))
	else:
		print("lp or us is None")
	db.session.add(lxu)
db.session.commit()


quests = []

quests.append(models.Question(question="I can identify learner profiles and categorise accordingly",usid=123396,roleid=11,saqid=1,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles of competence frameworks",usid=123396,roleid=11,saqid=2,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse job requirements and performance areas of a learner and translate these into the applicable learning outcomes",usid=123396,roleid=11,saqid=3,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a competence profile",usid=123396,roleid=11,saqid=4,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can distinguish between the various methods of skills analysis",usid=15218,roleid=11,saqid=5,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can integrate ETD skills analysis with broader organisational processes",usid=15218,roleid=11,saqid=6,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what types of information are required for a skills analysis",usid=15218,roleid=11,saqid=7,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can communicate on the purpose and structure of a skills analysis",usid=15218,roleid=11,saqid=8,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can manage stakeholders in order to facilitate a smooth execution of a skills needs analysis",usid=15218,roleid=11,saqid=9,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plot and complete a matrix of outcomes",usid=15218,roleid=11,saqid=10,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know how to define outcomes by using the correct outcomes-based terminology",usid=15218,roleid=11,saqid=11,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse the results from a skills analysis and determine areas for development",usid=15217,roleid=11,saqid=12,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can prioritise areas for development that will address immediate needs",usid=15217,roleid=11,saqid=13,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can integrate needs analysis results with other organisation processes",usid=15217,roleid=11,saqid=14,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can report and make recommendations on the results of a needs analysis",usid=15217,roleid=11,saqid=15,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an organisational training and development plan",usid=15217,roleid=11,saqid=16,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can integrate the training and development plan with legislative reporting requirements, i.e., WSP's",usid=15217,roleid=11,saqid=17,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can match learner development needs with the appropriate learning interventions",usid=15232,roleid=11,saqid=18,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know how to prioritise development needs taking into consideration organisation requirements",usid=15232,roleid=11,saqid=19,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles behind the selection of service providers for learning",usid=15232,roleid=11,saqid=20,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify factors within an organisation that are conducive to creating a learning environment",usid=15222,roleid=11,saqid=21,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a strategy for an organisation to improve its current learning culture",usid=15222,roleid=11,saqid=22,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles behind the promotion and advancement of learning within an organisation",usid=15222,roleid=11,saqid=23,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the role and function of the SDF within an organization",usid=15221,roleid=11,saqid=24,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the role and function of the ETD practitioner within an organisation",usid=15221,roleid=11,saqid=25,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can advise organisations on how to comply with current ETD legislation",usid=15221,roleid=11,saqid=26,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the philosophy behind outcomes-based education",usid=114924,roleid=13,saqid=27,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the major differences between OBET and other types of training delivery",usid=114924,roleid=13,saqid=28,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the philosophy behind OBET assessments",usid=114924,roleid=13,saqid=29,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the role and purpose of the NQF",usid=114924,roleid=13,saqid=30,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand how standards are set and what the requirements are for standards development",usid=114924,roleid=13,saqid=31,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know what processes are involved in standard development and registration",usid=114924,roleid=13,saqid=32,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand how qualifications are constructed within the SAQA frameworks",usid=114924,roleid=13,saqid=33,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand how qualifications are developed and registered within the SAQA processes",usid=114924,roleid=13,saqid=34,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can draft learning outcomes for learning programmes in accordance with outcomes-based education requirements",usid=123401,roleid=13,saqid=35,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop assessment criteria for identified learning outcomes or learning programmes",usid=123401,roleid=13,saqid=36,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse existing learning materials and programmes to determine compliance to OBET requirements",usid=123401,roleid=13,saqid=37,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what learning needs to take place taking into consideration learner profiles and organisation requirements",usid=123401,roleid=13,saqid=38,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design a learning programme in accordance with OBET requirements and specifications",usid=123401,roleid=13,saqid=39,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a brief that clearly states the requirements and specifications for a learning programme",usid=123401,roleid=13,saqid=40,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can accurately define the resources and requirements in the development of OBET programmes",usid=123394,roleid=13,saqid=41,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop OBET material that is consistent with OBET requirements",usid=123394,roleid=13,saqid=42,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles of adult learning and the factors that influence it",usid=123394,roleid=13,saqid=43,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop facilitation guidelines that explain exactly what learning needs to be delivered through specific methodologies",usid=123394,roleid=13,saqid=44,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to launch OBET pilot programmes to determine applicability and effectiveness",usid=123394,roleid=13,saqid=45,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adapt my written communication to match my target group",usid=123394,roleid=13,saqid=46,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify specific formats, templates and document prescriptions used within specific environments",usid=123394,roleid=13,saqid=47,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can gather, interpret, understand and comment on information within the ETDP field in an accurate manner",usid=123394,roleid=13,saqid=48,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can edit existing written documentation in order to improve its clarity, meaning and impact",usid=123394,roleid=13,saqid=49,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to assess learners with special needs using the appropriate tools",usid=10305,roleid=13,saqid=50,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am sensitive to the legislative requirements regarding persons with disabilities",usid=10305,roleid=13,saqid=51,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am aware of the various types of learning disabilities that exist",usid=10305,roleid=13,saqid=52,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify appropriate learning methods and techniques to match learners with learning disabilities",usid=10305,roleid=13,saqid=53,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop appropriate learning material to meet the requirements of learners with learning disabilities",usid=10305,roleid=13,saqid=54,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can put monitoring mechanisms in place to manage the progress of learners with learning disabilities",usid=10305,roleid=13,saqid=55,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can report on the assessment of learning disabilities and provide recommendations",usid=10305,roleid=13,saqid=56,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a document that clearly outlines the activities and responsibilities during a project aimed at developing qualifications or standards",usid=117856,roleid=13,saqid=57,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can easily explain/justify the reason for developing a specific qualification or standard",usid=117856,roleid=13,saqid=58,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify external and internal stakeholders that need to be involved in designing a qualification or standard",usid=117856,roleid=13,saqid=59,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to identify resources required in the qualification and standards design process",usid=117858,roleid=13,saqid=60,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a qualification or standards so that it meets the approval of the SGB and SAQA",usid=117858,roleid=13,saqid=61,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can write qualifications and standards using the correct terminology",usid=117858,roleid=13,saqid=62,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop standards to meet the specific requirements of a qualification",usid=117858,roleid=13,saqid=63,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop assessment criteria for the specific learning outcome of a standard",usid=117858,roleid=13,saqid=64,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know what supporting documentation is required to submit with the qualification/standard approval process",usid=117858,roleid=13,saqid=65,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand what is involved in the planning of learning interventions",usid=117870,roleid=14,saqid=66,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adapt learning plans to accommodate learner-specific needs",usid=117871,roleid=14,saqid=67,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the various learning methodologies best suited for meeting learner needs",usid=117871,roleid=14,saqid=68,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop presentations based on the outcomes based education principles",usid=117870,roleid=14,saqid=69,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand and can apply the principles of the demonstration technique",usid=117871,roleid=14,saqid=70,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can use a variety of aids to assist in training delivery (e.g. audio, visual, supporting materials, etc.)",usid=117870,roleid=14,saqid=71,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know, understand and can apply the fundamentals of group facilitation during training delivery",usid=117871,roleid=14,saqid=72,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can deliver training against outcome-based principles and techniques",usid=117871,roleid=14,saqid=73,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can utilise groups, groupwork and group sessions in improving the delivery of training outcomes",usid=117871,roleid=14,saqid=74,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adapt the structure and methodology of the training session to accommodate learner progress and understanding",usid=117877,roleid=14,saqid=75,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide relevant and constructive feedback aimed at improving learner performance",usid=117877,roleid=14,saqid=76,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to express myself clearly in a group situation",usid=117870,roleid=-1,saqid=77,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am sensitive towards the impact that diversity has on the meaning of messages",usid=117870,roleid=-1,saqid=78,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to identify hidden messages in discussions within group or individual context",usid=-1,roleid=-1,saqid=79,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to identify reactions to my own communication and adjust my communication accordingly to enhance understanding and collaboration",usid=-1,roleid=-1,saqid=80,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the application of learning outcomes into the workplace",usid=123398,roleid=14,saqid=81,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles of performance measurement",usid=123398,roleid=14,saqid=82,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can differentiate between the principles of counselling vs giving instruction ",usid=123398,roleid=14,saqid=83,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify and analyse learner needs and requirements accurately",usid=123398,roleid=14,saqid=84,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to consult with learners and accurately address their development needs",usid=117874,roleid=14,saqid=85,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an individual development plan for a learner",usid=117874,roleid=14,saqid=86,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to update an individual development plan in relation to the individual's performance assessment",usid=117874,roleid=14,saqid=87,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the various types of special needs that learners may have",usid=117874,roleid=14,saqid=88,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what types of barriers there are to learners with special needs",usid=117874,roleid=14,saqid=89,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adjust my type and level of support to meet learners' special requirements",usid=10294,roleid=14,saqid=90,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can easily judge when a learner requires additional support from external persons or bodies",usid=10294,roleid=14,saqid=91,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what strategies will be required to assist learners in their special learning needs",usid=10294,roleid=14,saqid=92,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can determine what learning information is required from analysing learner needs",usid=117865,roleid=14,saqid=93,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can easily identify the different types of support provided by either internal or external persons or bodies",usid=117865,roleid=14,saqid=94,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles behind learner guidance and support",usid=117865,roleid=14,saqid=95,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to record the results of learner guidance and support in the required manner",usid=117865,roleid=14,saqid=96,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can assess the effectiveness of learning service providers against the required learning outcomes",usid=117865,roleid=14,saqid=97,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can conduct an analysis of source documents ( including unit standards ) to identify, sequence and cluster the knowledge, skills and attitude outcomes to be assessed",usid=115755,roleid=12,saqid=98,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can define the evidence I want the learner to provide",usid=115755,roleid=12,saqid=99,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan a strategy for collecting the evidence",usid=115755,roleid=12,saqid=100,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to identify the criteria for designing an assessment instrument",usid=115755,roleid=12,saqid=101,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an assessment instrument with ease",usid=115755,roleid=12,saqid=102,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the difference between assessments required for RPL and learning programmes",usid=115755,roleid=12,saqid=103,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the philosophy behind outcomes-based assessments, and the difference between outcomes-based and traditional approaches",usid=115755,roleid=12,saqid=104,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the different types of assessments used in a particular learning programme",usid=115755,roleid=12,saqid=105,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles of assessment, including validity, reliability and fairness",usid=115753,roleid=12,saqid=106,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know what the requirements are for assessment instruments to be valid and reliable",usid=115753,roleid=12,saqid=107,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an assessment guide that accompanies an assessment instrument",usid=115753,roleid=12,saqid=108,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to distinguish between good quality and somewhat poorer quality guides",usid=115753,roleid=12,saqid=109,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain NQF assessment methodology to learners",usid=12544,roleid=12,saqid=110,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can guide learners to understand what is expected from them during specific assessments",usid=12544,roleid=12,saqid=111,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can assist learners in identifying the most appropriate evidence required for assessments",usid=12544,roleid=12,saqid=112,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide learners with the necessary frameworks for evidence collection",usid=12544,roleid=12,saqid=113,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can assist learners in compiling and organising their evidence documentation",usid=12544,roleid=12,saqid=114,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles against which evidence should be measured",usid=12544,roleid=12,saqid=115,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify gaps in learner evidence and coach towards improving such evidence",usid=12544,roleid=12,saqid=116,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan the assessment",usid=115753,roleid=12,saqid=117,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can conduct assessments in a developmental way, creating a supportive and enabling environment in which the learner can show what they are capable of",usid=115753,roleid=12,saqid=118,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide constructive feedback to the learner about the results",usid=115753,roleid=12,saqid=119,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can review the assessment to identify strengths and weaknesses of my role",usid=115753,roleid=12,saqid=120,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can record the results of assessment in ways that will satisfy the requirements of moderation and the ETQA",usid=115753,roleid=12,saqid=121,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a strategy for assessment which will transform my education and training program",usid=115753,roleid=12,saqid=122,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the role and function of a moderator",usid=115759,roleid=12,saqid=123,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan, prepare and conduct moderation",usid=115759,roleid=12,saqid=124,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide advice and guidance to assessors and assessment agencies",usid=115759,roleid=12,saqid=125,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can report, record and administer moderation",usid=115759,roleid=12,saqid=126,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can review moderation systems and processes",usid=115759,roleid=12,saqid=127,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand assessment policies and ETQA requirements",usid=115759,roleid=12,saqid=128,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know moderation systems and techniques",usid=115759,roleid=12,saqid=129,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand quality assurance policies and procedures",usid=115759,roleid=12,saqid=130,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand how to evaluate the effectiveness of a learning programme against OBET and organisational quality assurance criteria",usid=123397,roleid=12,saqid=131,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design a strategy for evaluating a learning intervention",usid=123397,roleid=12,saqid=132,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can implement the evaluation of a learning intervention",usid=123397,roleid=12,saqid=133,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can collate and analyse data and provide recommendations to improve a learning programme",usid=123397,roleid=12,saqid=134,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate the feasibility of the recommendations made in the evaluation report",usid=123397,roleid=12,saqid=135,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can reflect the effectiveness of my evaluation strategy and decide on adaptations if required",usid=123397,roleid=12,saqid=136,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know a range of techniques for conducting evaluations",usid=123397,roleid=12,saqid=137,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can find sources to benchmark my evaluation strategy and the findings of my evaluation",usid=123397,roleid=12,saqid=138,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the various types of pre-training session administrative requirements",usid=15227,roleid=10,saqid=139,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can communicate on course arrangements and logistics to learners prior to course commencement",usid=15227,roleid=10,saqid=140,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what administrative tasks need to be executed during training courses",usid=15227,roleid=10,saqid=141,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify what reports and documents are required after courses have been delivered",usid=15227,roleid=10,saqid=142,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know what information needs to be contained in post course documentation",usid=15227,roleid=10,saqid=143,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design course administration documents so that they meet quality assurance criteria",usid=123393,roleid=10,saqid=144,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can compile schedules that depict the nature, type and timing of learning interventions",usid=123393,roleid=10,saqid=145,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to manage and co-ordinate all activities surrounding learning interventions",usid=123393,roleid=10,saqid=146,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can categorise and record the various types of ETD data so that it can be easily accessible",usid=114925,roleid=10,saqid=147,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate ETD information for correctness and accuracy",usid=114925,roleid=10,saqid=148,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the external sources and databases that are available regarding learner information",usid=114925,roleid=10,saqid=149,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify risks related to ETD data storage and maintenance",usid=114925,roleid=10,saqid=150,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I have experience in dealing with information management systems",usid=114925,roleid=10,saqid=151,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can differentiate between types of learner information that is frequently required vs information not so frequently required",usid=114925,roleid=10,saqid=152,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the purpose of a quality management system",usid=15228,roleid=10,saqid=153,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the similarities and differences between different quality standards and quality models",usid=15228,roleid=10,saqid=154,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the role and function of SAQA",usid=15228,roleid=10,saqid=155,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the SAQA requirements for ETD quality management systems",usid=15228,roleid=10,saqid=156,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I have assisted in the planning, development and implementation of a quality management system within the ETD sphere",usid=15228,roleid=10,saqid=157,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a quality policy statement relating to ETD",usid=15228,roleid=10,saqid=158,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan the scope of a quality policy relating to ETD",usid=15228,roleid=10,saqid=159,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a standard operating procedure",usid=15228,roleid=10,saqid=160,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can set quality objectives for the improvement of standard operating procedures",usid=15228,roleid=10,saqid=161,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify performance indicators that reflect effective skills development practices",usid=15228,roleid=10,saqid=162,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can measure the success of learning interventions against ETD quality management  requirements",usid=15228,roleid=10,saqid=163,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I have lead teams before",usid=15237,roleid=10,saqid=164,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the factors that can hinder team work",usid=15237,roleid=10,saqid=165,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can effectively utilise team members for their strengths",usid=15237,roleid=10,saqid=166,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can effectively function within a team without necessarily working in isolation to the other members",usid=15237,roleid=10,saqid=167,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify the various roles that team members can play",usid=15224,roleid=10,saqid=168,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the philosophy of inclusive decision making",usid=15224,roleid=10,saqid=169,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can encourage non-active team members into active participation",usid=15224,roleid=10,saqid=170,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify remedies to improve team performance",usid=15224,roleid=10,saqid=171,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I understand the principles of delegation",usid=15224,roleid=10,saqid=172,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can utilise the diverseness of team members to improve team work",usid=15233,roleid=10,saqid=173,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to manage conflict within teams constructively",usid=15233,roleid=10,saqid=174,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am comfortable to function within diverse work groups",usid=15233,roleid=10,saqid=175,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I know how to establish common ground when working with a diverse team",usid=15233,roleid=10,saqid=176,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can measure team performance against the set project deliverables",usid=10146,roleid=10,saqid=177,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the purpose, principles, foundational assumptions, key features and impact of quality assurance systems",usid=15191,roleid=10,saqid=178,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the nature and appropriateness of a variety of data gathering techniques",usid=15191,roleid=10,saqid=179,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the evaluation process to providers",usid=15191,roleid=10,saqid=180,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan an evaluation process to enable the objectives of the evaluation to be met within available resources",usid=15191,roleid=10,saqid=181,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate a provider's quality assurance system",usid=15191,roleid=10,saqid=182,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can conduct the evaluation in a manner that facilitates cooperation, conflict resolution and communication",usid=15191,roleid=10,saqid=183,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able comply with regulations, evaluation principles and ethics whilst implementing quality management systems",usid=15191,roleid=10,saqid=184,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate the implementation of a provider's quality assurance system",usid=15191,roleid=10,saqid=185,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to report on the extent of compliance with quality standards, areas requiring corrective action, and recommendations for improvement",usid=15191,roleid=10,saqid=186,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify opportunities for improving the evaluation process",usid=15191,roleid=10,saqid=187,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to maintain confidentiality of information at all times",usid=15191,roleid=10,saqid=188,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify and explain the component parts of the ETD process",usid=123391,roleid=10,saqid=189,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe the current organizational philosophy regarding quality assurance ito implications for human resource development and quality management of ETD",usid=123391,roleid=10,saqid=190,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain core organisational values and concepts",usid=123391,roleid=10,saqid=191,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an ETD framework for the organisation",usid=123391,roleid=10,saqid=192,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can benchmark the proposed framework against international models",usid=123391,roleid=10,saqid=193,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop quality management policies and procedures to guide and measure ETD practices",usid=123391,roleid=10,saqid=194,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to align quality management systems with quality assurance body guidelines and requirements",usid=123391,roleid=10,saqid=195,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can monitor, evaluate and review ETD policies and procedures",usid=123391,roleid=10,saqid=196,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain quality principles and systems",usid=123391,roleid=10,saqid=197,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse a range of situations and purposes for which evaluation instruments are required",usid=123392,roleid=10,saqid=198,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain a range of evaluation techniques",usid=123392,roleid=10,saqid=199,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can compare different approaches to evaluation",usid=123392,roleid=10,saqid=200,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design a range of evaluation instruments for different evaluation methods",usid=123392,roleid=10,saqid=201,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can conduct a basic statistical analysis",usid=123392,roleid=10,saqid=202,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop clear, structured, fit-for-purpose evaluation instruments",usid=123392,roleid=10,saqid=203,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide appropriate guidelines concerning the purpose and use of the evaluation instruments",usid=123392,roleid=10,saqid=204,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can critique and revise evaluation instruments using objective, measurable, sufficient and fit-for-purpose criteria",usid=123392,roleid=10,saqid=205,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to establish what an organisations learning needs are",usid=123400,roleid=10,saqid=206,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can define learning needs ito outcomes of learning, target group and learning priorities",usid=123400,roleid=10,saqid=207,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify terms of reference for potential solutions",usid=123400,roleid=10,saqid=208,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan and organize an evaluation of potential providers",usid=123400,roleid=10,saqid=209,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate providers, products and services against pre-determined and agreed evaluation criteria",usid=123400,roleid=10,saqid=210,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can record and report the evaluation decisions and recommendations",usid=123400,roleid=10,saqid=211,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can justify recommendations made as a result of a provider evaluation",usid=123400,roleid=10,saqid=212,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can promote providers, products and services to raise awareness within a specific target group",usid=123400,roleid=10,saqid=213,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to explain key concepts of strategic governance as it relates to providers",usid=114922,roleid=11,saqid=214,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to explain the difference between strategic governance and management",usid=114922,roleid=11,saqid=215,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify roles and responsibilities within governance structures",usid=114922,roleid=11,saqid=216,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to apply models of strategic governance in business analysis",usid=114922,roleid=11,saqid=217,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to analyse the strategic governance status of a FET & HET education & training provider",usid=114922,roleid=11,saqid=218,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to guide the strategic governance planning process for ETD providers",usid=114922,roleid=11,saqid=219,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to assist a training provider to take up the challenges and responsibilities implicit in involvement with the NQF",usid=114922,roleid=11,saqid=220,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse the environment to determine the need for learnerships and skills programmes",usid=114926,roleid=11,saqid=221,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify opportunities for implementing learnerships or skills programmes",usid=114926,roleid=11,saqid=222,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to develop a strategic plan for the use of learnships or skills programmes in an organisation",usid=114926,roleid=11,saqid=223,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan the implementation of learnerships/skills programmes",usid=114926,roleid=11,saqid=224,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the purpose of learnerships/skills programmes in relation to the NSDS",usid=114926,roleid=11,saqid=225,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe the characteristics and benefits of learnerships/skills programmes",usid=114926,roleid=11,saqid=226,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate systems for the management of assessment",usid=116810,roleid=12,saqid=227,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop an organizational assessment plan",usid=116810,roleid=12,saqid=228,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can contribute to and promote assessment policies and quality assurance processes within the organisations",usid=116810,roleid=12,saqid=229,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can support the assessment team",usid=116810,roleid=12,saqid=230,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can monitor and review assessment at organisational level",usid=116810,roleid=12,saqid=231,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to analyse learning needs within my sector or local context",usid=116811,roleid=11,saqid=232,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to evaluate current management of learning in relation to organizational needs and strategic objectives",usid=116811,roleid=11,saqid=233,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify weaknesses/gaps in relation to both internal and external management requirements",usid=116811,roleid=11,saqid=234,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan the development of learning programmes and provision",usid=116811,roleid=11,saqid=235,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to contribute to and support ETD policies and quality assurance processes within the organisation",usid=116811,roleid=11,saqid=236,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can promote the principles of access, redress, flexibility and RPL",usid=116811,roleid=11,saqid=237,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to monitor and support an ETD team",usid=116811,roleid=11,saqid=238,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can monitor and review learning provision systems",usid=116811,roleid=11,saqid=239,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the concepts underpinning RPL",usid=116587,roleid=12,saqid=240,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the purposes of RPL in South Africa",usid=116587,roleid=12,saqid=241,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain national and international models and trends in RPL",usid=116587,roleid=12,saqid=242,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can investigate current RPL practice in an organisation or sector",usid=116587,roleid=12,saqid=243,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to develop RPL policies, procedures and plans for an organisation",usid=116587,roleid=12,saqid=244,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide RPL advice and support to those involved or interested in RPL",usid=116587,roleid=12,saqid=245,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide advice and support in a way that promotes the objectives of the NQF in general and RPL in particular",usid=116587,roleid=12,saqid=246,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan and implement an advocacy campaign to promote RPL practices",usid=116587,roleid=12,saqid=247,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can monitor and evaluate RPL trends and practices to improve RPL practice",usid=116587,roleid=12,saqid=248,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to critique standards in relation to the requirements of national quality criteria and the requirements of the relevant quality assurance body",usid=117861,roleid=13,saqid=249,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to critique qualifications in relation to the requirements of national quality criteria and the requirements of the relevant quality assurance body",usid=117861,roleid=13,saqid=250,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to detect and record variances and shortcomings in technical specifications, performance statements and format of standards and qualifications",usid=117861,roleid=13,saqid=251,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide feedback on standards and qualifications to the relevant individuals or bodies",usid=117861,roleid=13,saqid=252,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can secure and store all documentation and records",usid=117861,roleid=13,saqid=253,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse the results of skills analyses, outcomes analyses and the organisational training and development plan to identify the full spectrum of learning outcomes required by the organisation",usid=123399,roleid=13,saqid=254,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can select outcomes for which the organisation plans to offer or resource learning. ",usid=123399,roleid=13,saqid=255,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can develop a plan to outline the functions, roles and levels of involvement of all participants. ",usid=123399,roleid=13,saqid=256,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design a framework that forms a series of learning pathways and a coherent whole, with useful and appropriate linkages between the various components. ",usid=123399,roleid=13,saqid=257,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can pilot and evaluate a learning framework",usid=123399,roleid=13,saqid=258,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can identify opportunities and mechanisms to improve upon the learning framework",usid=123399,roleid=13,saqid=259,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adapt my level and style of language to suit different groups of learners",usid=7389,roleid=12,saqid=260,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can suggest strategies for dealing with language difficulties",usid=7389,roleid=12,saqid=261,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain relevant symbols used in text",usid=7389,roleid=12,saqid=262,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the layout and style of visuals used in learning materials",usid=7389,roleid=12,saqid=263,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to help learners to use printed learning materials and guides",usid=7389,roleid=12,saqid=264,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to help learners to produce text and assignments of their own",usid=7389,roleid=12,saqid=265,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to diagnose learner problems in relation to learning and assessment and make recommendations for assistance",usid=117864,roleid=14,saqid=266,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to conduct learner counseling in a professional manner",usid=117864,roleid=14,saqid=267,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can refer learners to appropriate external services when necessary",usid=117864,roleid=14,saqid=268,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can provide advice that will assist learners to develop effective learning strategies",usid=117864,roleid=14,saqid=269,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to advise learners how to learn",usid=117864,roleid=14,saqid=270,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate the quality and effectiveness of my counseling",usid=117864,roleid=14,saqid=271,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can evaluate the quality of support services provided",usid=117864,roleid=14,saqid=272,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain the principles of counseling in a diverse social and cultural environment",usid=117864,roleid=14,saqid=273,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to describe the history and struggle for human rights in South Africa.",usid=119661,roleid=14,saqid=274,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain how the Constitution and Bill of Rights promote and support human rights and democracy within South Africa.",usid=119661,roleid=14,saqid=275,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe and explain human rights and democratic principles and values in South Africa.",usid=119661,roleid=14,saqid=276,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can outline the influence of historical events and violations internationally and regionally on the development of universal human rights.",usid=119661,roleid=14,saqid=277,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe key events that influenced the Universal Declaration of Human Rights and the African Charter of Human Rights",usid=119661,roleid=14,saqid=278,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to analyse a complex situation to identify appropriate facilitation approaches",usid=123395,roleid=14,saqid=279,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can design a flexible, responsive facilitation process",usid=123395,roleid=14,saqid=280,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can adapt facilitation activities to respond to emerging direction and dynamics",usid=123395,roleid=14,saqid=281,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to manage group dynamics and conflict in a complex facilitation situation",usid=123395,roleid=14,saqid=282,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can establish facilitation evaluation criteria in an open and participatory manner",usid=123395,roleid=14,saqid=283,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can critically review the facilitation process, dynamics and outcomes",usid=123395,roleid=14,saqid=284,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to report on the facilitation process",usid=123395,roleid=14,saqid=285,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I am able to explain and use the psychology of group dynamics",usid=123395,roleid=14,saqid=286,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can mediate learning in an open, participatory, democratic way",usid=123395,roleid=14,saqid=287,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe the main sources of conflict that may arise in a workplace",usid=114226,roleid=10,saqid=288,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can explain conflict management techniques",usid=114226,roleid=10,saqid=289,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can plan strategies to manage conflict",usid=114226,roleid=10,saqid=290,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can describe the attributes of a good conflict manager",usid=114226,roleid=10,saqid=291,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
quests.append(models.Question(question="I can analyse my own strengths and weaknesses as a conflict manager.",usid=114226,roleid=10,saqid=292,questiontype=0,possibleanswers="Disagree strongly;Disagree;Uncertain;Agree;Agree strongly"))
iprev = 0

a0 = models.Assessment(name="OD-ETDP competence self-assessment",
                               ttype=4,
                               qualid=-1,
                               redotimes=-1,
                               timelimit=-1)
a1 = models.Assessment(name="English literacy",
                               ttype=5,
                               qualid=-1,
                               redotimes=-1,
                               timelimit=-1)
a2 = models.Assessment(name="Mathematics numeracy",
                               ttype=5,
                               qualid=-1,
                               redotimes=-1,
                               timelimit=-1)
db.session.add(a0)
db.session.add(a1)
db.session.add(a2)
db.session.commit()

for q in quests:
	if q.saqid == iprev + 1:
		usid = q.usid
		us = models.UnitStandard.query.filter_by(uscode=str(usid)).first()
		if us is not None:
			q.usid= us.id
		else:
			print("US does not exist {}".format(usid))
		q.assid = 1;
		db.session.add(q)
	else:
		print("Inconsistency around {}".format(iprev));
		break
	iprev += 1
db.session.commit()

qs = []

qs.append(models.Question(saqid=-1,question="16 ÷ 4 ÷ 2 = ".decode('utf8'),questiontype=0,answer=1,possibleanswers="1;2;4;8;10".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="15 x 8 - 80 = ".decode('utf8'),questiontype=0,answer=3,possibleanswers="30;120;45;40;4".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="35 - 9 - 13 = ".decode('utf8'),questiontype=0,answer=0,possibleanswers="13;21;12;14;15".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="(207 - 190) x 3 = ".decode('utf8'),questiontype=0,answer=4,possibleanswers="263;50;41;20;51".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="(70 - 14) ÷ 8 = ".decode('utf8'),questiontype=0,answer=2,possibleanswers="6;8.25;7;9;-3".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="(19 + 12) x 3 = ".decode('utf8'),questiontype=0,answer=1,possibleanswers="55;93;63;91;34".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="42 ÷ 3 - 9 = ".decode('utf8'),questiontype=0,answer=0,possibleanswers="5;21;14;117;30".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="13 x 12 - 66 = ".decode('utf8'),questiontype=0,answer=0,possibleanswers="90;88;156;100;41".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="5.3 + 6.5 + 4.7 = ".decode('utf8'),questiontype=0,answer=1,possibleanswers="17.5;16.5;15.5;165;162".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="20.5 - 6.25 + 4.75 = ".decode('utf8'),questiontype=0,answer=4,possibleanswers="18;31.5;9.5;19.25;19".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="0.25 x 6 ÷ 4 = ".decode('utf8'),questiontype=0,answer=3,possibleanswers="4;1.521;40;0.375;2.25".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="36.5 + 49.9 - 13.42 = ".decode('utf8'),questiontype=0,answer=4,possibleanswers="73;72.89;27.98;72.99;72.98".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="3.2 + 157.8 ÷ 4 = ".decode('utf8'),questiontype=0,answer=1,possibleanswers="40.26;40.25;41.25;41.26;40.62".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="153.872 ÷ 16.7 x 12 = ".decode('utf8'),questiontype=0,answer=0,possibleanswers="110.5667;110.5657;110.7657;110.7687;110.7587".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="131 ÷ 5.325 x 4 = ".decode('utf8'),questiontype=0,answer=2,possibleanswers="98.403755969;98.412755969;98.403755869;98.503756869;98.50375687".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="How much is 4 cents and six cents? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="8 cents;6 cents;10 cents;12 cents;0.08".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When a person buys 6 cents worth of stamps and gives the shop assistant ten cents. How much change should the person get back? ".decode('utf8'),questiontype=0,answer=4,possibleanswers="2 cents;3 cents;7 cents;5 cents;4 cents".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="In five years time Steven will be 13 years old. How old is he now? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="7;18;8;12;3".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Sally's mass is twice a much as that of her brother. Her brother's mass is 20 kilograms. What is Sally's mass? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="10;25;40;20;12".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="John is 8 years old and he's twice as old as his sister. How old is she now? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="4;2;6;16;5".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When a certain number is multiplied by 2 and 3 is added, the answer is 63. What is the number? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="20;15;30;52;12".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="There are 20 pupils in a class. 15 are boys. How many more boys than girls are there? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="5;8;2;10;15".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="An upright post 6 meters high, casts a shadow of 2 meters. What is the height of a building which, at the same time and at the same place, casts a shadow of 30 meters? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="120;100;90;65;25".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Which number is as much less than 12 as it is more than 4? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="12;4;6;8;18".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="A boy and a girl divide 16 apples between them. The girl gets three times as many as the boy. How many does she get? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="12;10;6;14;5".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="If 7 articles cost 25 cents, how many can you get for a rand? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="12;36;28;48;7".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="An article costs R200. If a customer gets 5% discount for cash. How much will the customer pay for the article? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="170;190;195;160;165".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="A hall is carpeted with 12 carpets, all of exactly the same size. If the total area of the floor is 240 square meters. What is the area covered by each carpet? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="25 square metres;10 square metres;20 square metres;100 square metres;80 square metres".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="A man bought a second-hand motor-bike for two-thirds of what it had cost new. He paid R400 for it; how much had it cost new? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="600;800;400;1000;700".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Eight men can finish a job in six days. How many men will be needed to finish it in half a day? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="60;65;94;96;86".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="86 - 14 = 9 + ? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="26;59;63;21;98".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="23 + 18 = ? + 6 ".decode('utf8'),questiontype=0,answer=2,possibleanswers="36;28;35;41;12".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="5 ? 1 = 20 ÷ 5 ".decode('utf8'),questiontype=0,answer=3,possibleanswers="x;+;÷;-;%".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="16 + 75 ÷ 7 = ? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="14;13;17;6;21".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="? + 68 = 16 x 9 ".decode('utf8'),questiontype=0,answer=0,possibleanswers="76;72;51;101;22".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="9 x ? = 63 ".decode('utf8'),questiontype=0,answer=4,possibleanswers="10;3;5;12;7".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="4 ? 12 = 48 ".decode('utf8'),questiontype=0,answer=1,possibleanswers="+;x;÷;%;-".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="45% of 70 = ".decode('utf8'),questiontype=0,answer=2,possibleanswers="28;22.5;31.5;38;42".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="47 ? 19 = 893 ".decode('utf8'),questiontype=0,answer=1,possibleanswers="+;x;÷;%;-".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="175 ? 52 = 227 ".decode('utf8'),questiontype=0,answer=3,possibleanswers="÷;%;-;+;x".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="10% of R24.80 ".decode('utf8'),questiontype=0,answer=1,possibleanswers="0.25;2.48;0.24;0.26;2.6".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="100 ? 8.24 = 12.136 ".decode('utf8'),questiontype=0,answer=1,possibleanswers="%;÷;-;+;x".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="9 x 6 + 33 = 3 ? 8 + 76 ".decode('utf8'),questiontype=0,answer=4,possibleanswers="÷;%;-;x;+".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="215mm - 5 cm + 1.5 m = ?m ".decode('utf8'),questiontype=0,answer=2,possibleanswers="1.8;2.3;2;4;3.5".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="5 x 3m - ?cm = 2400mm ".decode('utf8'),questiontype=0,answer=3,possibleanswers="1120;860;1020;1260;640".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What number comes next in the series: 2, 3, 5, 9, ? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="12;13;17;19;22".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Assuming that a car is moving at a constant speed. If the car takes 4 hours and 20 minutes to cover 260 kilometers. How many kilometers are covered each hour? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="80;65;90;60;40".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What number comes next in the series: 2, 4, 16, ? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="256;32;54;72;36".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Which number is as much bigger than 3 x 3 as it is smaller than 5 x 5? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="22;17;12;37;14".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When a boy eats 6 apples every day. How many weeks will it take him to devour a bumper box of 210? ".decode('utf8'),questiontype=0,answer=4,possibleanswers="4;12;10;8;5".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What number comes next in the series: 4, 10, 22, 46, ? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="94;54;102;98;68".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When a man jogs at a speed of 5 kilometers per hour, how long will it take him to cover a distance of 13 kilometers? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="1h 10m;1h 30m;3h 20m;2h 36m;2h 10m".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Some square bathroom tiles each consist of a pattern of 3 triangles fitted together. When a wall is covered with 135 such triangles, how many tiles have been used? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="35;45;405;225;60".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What number comes next in the series: 360, 72, 18, 6, ? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="5;4;3;2;1".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Three builders working together each lay 96 bricks an hour. How many hours would it take them to build a wall consisting of 7,200 bricks? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="50;60;120;25;140".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Following a rainstorm, the level of water in a barrel has risen from 13mm to 37mm. If the water level rose at a constant rate of 3mm every 2 minutes, for how long did the rainstorm last? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="20 minutes;16 minutes;12 minutes;36 minutes;28 minutes".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Which number is as much more than 2 dozen as 2 is less than half a dozen? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="12;36;22;28;14".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What does D equal when 7D -12 = 5D + 6? ".decode('utf8'),questiontype=0,answer=1,possibleanswers="6;9;3;1;2".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="What number comes in the series: 8, 12, 18, 26, ? ".decode('utf8'),questiontype=0,answer=2,possibleanswers="42;52;36;64;96".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When 3 eggs is required to make an omelette, and 10% of 5 dozen eggs are spoiled, how many omelettes can be made from this batch? ".decode('utf8'),questiontype=0,answer=0,possibleanswers="18;6;8;14;22".decode('utf8'),usid=-1,assid=-1,roleid=-1))

for q in qs:
	q.assid = 3;
	db.session.add(q)
db.session.commit()

qs = []
qs.append(models.Question(saqid=-1,question="She didn't get no words right. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She run to the door. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="I wish that I were going to Durban with you. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We don't usually work on a saturday. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Marys handwriting was very good. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We live in the city of johannesburg. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He reads the finansial page every day. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question='''The foreman said, “do it like this". '''.decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When you get to the report on steel type as much of it as you can and leave what you have   completed on my desk when you leave. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We don't work on christmas. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question='''"Robert opened the door quietly, stepped into the room and said ""Father, I'm ready to go now.""'''.decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The school principal walked down the corridor, turned the corner, and strided into the gymnasium ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Although the school offered a number of courses in History, English and mathematics, there were no foreign languages taught. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The monitary value of the painting was great. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We will be late unless we hurry. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="There go the girls from the office. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Take dictation from Mr Johnson. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Name a contemperary writer whom you like. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Was that her who took the dictation? ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The twelvth day came, but no letter arrived ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Go to file 7 find record folder number 1376A and copy it for me. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We can go to the game; we have the tickets. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Her niece works in the adjacint building. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Do it this way, not as he did. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She was good in Algebra. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Yourself may do the job ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Should I retype the letter ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The drill was broken. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Mother, did I get any mail? ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="While you were out, Mr. Brown's secratary called to say that your appointment would have to be changed, perhaps to Friday, June 6. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The typewriter needs repairing, Miss Smith; however, there's no repairman available until tomorrow. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Alice when you leave the office please lock the file drawer. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="All girls had ought to take typing. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="I did all the work you gave me. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She went to Central high school. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="They eat it all up last week. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question=''''"""Have you finished the letter yet"" said the boss at quitting time?." '''.decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="An extencion cord can be dangerous. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The incidant was neither forgotten nor forgiven. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="I knew he would be late. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Please forward all correspondance to the home office. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question='''"The teacher said ""Hands in your papers"." '''.decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Walk through the room very quietly. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Where is Mary going ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Most schools begin in september. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The girls drank some water. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="They went to work in Port Elizabeth, situated in the eastern Cape. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The office opens at 915. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The letter has been tore. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question='''"""Stop turn the machine off"" he shouted." '''.decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Them things are easy for me. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Her hight was five feet, two inches. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The cricket team got off to a poor start, however, as the game progressed, the pitching improved, and the team won by two runs, both being scored in the ninth innings. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Please seperate the copies. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="My friend and me went to school. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="the typewriter needs cleaning. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She was hot, worried and tired. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The letter was dated September 26 1916. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Henry it will be all right. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The teacher left we were alone but worked on. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="I have never rode such a good horse. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We haven't but a few tools left. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Those who complied benifited. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He left his famly and went to work. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="I went to Doctor Hennings. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Mr. Johnson, smiling and waving to the crowd, ran up the steps into the waiting plain. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Type the questionaire soon, please. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="When you finish, if you do, you may go. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We began to work on the new job. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She left after I had went home. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Wait that is the wrong way. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The personel office is on your left. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We have a holiday on Mandelas birthday. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The room was so large that it seemed almost bare, although it contained the usual chairs, tables, lamps, etc that one expects to find in a doctor's office. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She earned a B in english. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He came to the End of the book. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We students did worked in the shop. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The tire on the autommobile was flat. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Try it this way it isn't difficult. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Give the paper to Miss Smith. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The difference, though slight, was noticable. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He read a book on world war II. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She could hardily read the letter. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Both he and I work there. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The student who we watched did well. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He dictated paused and changed his mind. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="She was a desendant of a long line of farmers. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="You should be however careful. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Did you think it was him? ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Address the letter To the Acme Company. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="A good workman don't make many mistakes. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Teacher, may I speak to him? ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Make six carbon copies file one and send three to Division 6. ".decode('utf8'),questiontype=0,answer=1,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He got up and dressed hisself. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="It was either he nor John. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We work in commissioner street. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He had to lie on the ground to repair the automobile. ".decode('utf8'),questiontype=0,answer=4,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He can do it as well as me. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He got a repreive; he was not guilty. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The address is in brooklyn. ".decode('utf8'),questiontype=0,answer=2,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="His obsequius manner soon became unpleasant. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question='''"How does one abreviate ""year""?" '''.decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="He and she taken a test. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="We seen them when they made it. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="Mary, please file the pamflet; then you may leave. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The teacher give her a pencil. ".decode('utf8'),questiontype=0,answer=3,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
qs.append(models.Question(saqid=-1,question="The salutacion of the letter was cordial. ".decode('utf8'),questiontype=0,answer=0,possibleanswers="Spelling error;Punctuation error;Capitalisation error;Usage or Grammar error;None".decode('utf8'),usid=-1,assid=-1,roleid=-1))
for q in qs:
	q.assid = 2;
	db.session.add(q)
db.session.commit()


f = [models.Field(name="Agriculture & Nature Conservation "),
     models.Field(name="Culture & Arts "),
     models.Field(name="Business Commerce and Management"),
     models.Field(name="Communication Studies and Language"),
     models.Field(name="Education, Training and Development"),
     models.Field(name="Manufacturing, Engineering and Technology"),
     models.Field(name="Human and Social Studies"),
     models.Field(name="Law, Military Science and Security"),
     models.Field(name="Health Sciences and Social Services"),
     models.Field(name="Mathemtical, Physical, Computer and Life Sciences"),
     models.Field(name="Services"),
     models.Field(name="Physical Planning and Construction")]
for field in f:
	db.session.add(field)
db.session.commit()

f = []
f.append(models.Subfield(fieldid=1,name="Primary Agriculture"))
f.append(models.Subfield(fieldid=1,name="Secondary Agriculture"))
f.append(models.Subfield(fieldid=1,name="Nature Conservation"))
f.append(models.Subfield(fieldid=1,name="Forestry and Wood Technology"))
f.append(models.Subfield(fieldid=1,name="Horticulture"))

f.append(models.Subfield(fieldid=2,name="Design Studies"))
f.append(models.Subfield(fieldid=2,name="Visual Arts"))
f.append(models.Subfield(fieldid=2,name="Performing Arts"))
f.append(models.Subfield(fieldid=2,name="Cultural Studies"))
f.append(models.Subfield(fieldid=2,name="Music"))
f.append(models.Subfield(fieldid=2,name="Sport"))
f.append(models.Subfield(fieldid=2,name="Film, Television and Video"))

f.append(models.Subfield(fieldid=3,name="Finance, Economic and Accounting"))
f.append(models.Subfield(fieldid=3,name="Generic Management"))
f.append(models.Subfield(fieldid=3,name="Human Resources"))
f.append(models.Subfield(fieldid=3,name="Marketing"))
f.append(models.Subfield(fieldid=3,name="Purchasing"))
f.append(models.Subfield(fieldid=3,name="Procurement"))
f.append(models.Subfield(fieldid=3,name="Office Administration"))
f.append(models.Subfield(fieldid=3,name="Public Administration"))
f.append(models.Subfield(fieldid=3,name="Project Administration"))
f.append(models.Subfield(fieldid=3,name="Public Relations"))

f.append(models.Subfield(fieldid=4,name="Communication"))
f.append(models.Subfield(fieldid=4,name="Information Studies"))
f.append(models.Subfield(fieldid=4,name="Language"))
f.append(models.Subfield(fieldid=4,name="Literature"))

f.append(models.Subfield(fieldid=5,name="Schooling"))
f.append(models.Subfield(fieldid=5,name="Higher Education and Training"))
f.append(models.Subfield(fieldid=5,name="Early Childhood Development"))
f.append(models.Subfield(fieldid=5,name="Adult Learning"))

f.append(models.Subfield(fieldid=6,name="Engineering and Related Design"))
f.append(models.Subfield(fieldid=6,name="Manufacturing and Assembly"))
f.append(models.Subfield(fieldid=6,name="Fabrication and Extraction"))

f.append(models.Subfield(fieldid=7,name="Environmental Relations"))
f.append(models.Subfield(fieldid=7,name="General Social Science"))
f.append(models.Subfield(fieldid=7,name="Industrial and Organisational Governance and Human Resource Development"))
f.append(models.Subfield(fieldid=7,name="People/Human Centred Development"))
f.append(models.Subfield(fieldid=7,name="Public Policy, Politics and Democratic Citizenship"))
f.append(models.Subfield(fieldid=7,name="Religious and Ethical Foundations of Society"))
f.append(models.Subfield(fieldid=7,name="Rural and Agrarian Studies"))
f.append(models.Subfield(fieldid=7,name="Traditions, History and Legacies"))
f.append(models.Subfield(fieldid=7,name="Urban and Regional studies"))

f.append(models.Subfield(fieldid=8,name="Safety in Society"))
f.append(models.Subfield(fieldid=8,name="Justice in Society"))
f.append(models.Subfield(fieldid=8,name="Sovereignty of the State"))

f.append(models.Subfield(fieldid=9,name="Preventive Health"))
f.append(models.Subfield(fieldid=9,name="Promotive Health and Development Services"))
f.append(models.Subfield(fieldid=9,name="Curative Health"))
f.append(models.Subfield(fieldid=9,name="Rehabilitative Services"))

f.append(models.Subfield(fieldid=10,name="Mathematical Sciences"))
f.append(models.Subfield(fieldid=10,name="Physical Sciences"))
f.append(models.Subfield(fieldid=10,name="Life Sciences"))
f.append(models.Subfield(fieldid=10,name="Information Technology and Computer Sciences"))
f.append(models.Subfield(fieldid=10,name="Earth and Space Sciences"))
f.append(models.Subfield(fieldid=10,name="Environmental Sciences"))

f.append(models.Subfield(fieldid=11,name="Hospitality, Tourism, Travel, Gaming and Leisure"))
f.append(models.Subfield(fieldid=11,name="Transport, Operations and Logistics"))
f.append(models.Subfield(fieldid=11,name="Personal Care"))
f.append(models.Subfield(fieldid=11,name="Wholesale and Retail"))
f.append(models.Subfield(fieldid=11,name="Consumer Services"))

f.append(models.Subfield(fieldid=12,name="Physical Planning, Design and Management"))
f.append(models.Subfield(fieldid=12,name="Building Construction"))
f.append(models.Subfield(fieldid=12,name="Civil Egineering Construction"))
f.append(models.Subfield(fieldid=12,name="Electrical Infrastructure Construction"))
for sub in f:
	db.session.add(sub)
db.session.commit()

for sub in models.Subfield.query.all():
	a0 = models.Assessment(name="Self Assessment",
	                       ttype=4,
	                       qualid=sub.id,
	                       redotimes=-1,
	                       timelimit=-1
	                       )


users = models.User.query.all()
asses = models.Assessment.query.all()
for u in users:
	for ass in asses:
		tr = models.TestResult(result=randrange(40,100),
		                       maxscore=100,
		                       assid=ass.id,
		                       starttime=datetime.datetime.now(),
		                       endtime=datetime.datetime.now(),
		                       TestDone="1",
		                       PercentCompleted=randrange(30,100),
		                       userid=u.id)
		db.session.add(tr)
		db.session.commit()
		qs = models.Question.query.filter_by(assid=ass.id).all()
		for q in qs:
			mark = models.Mark(answer="rdq{}".format(randrange(1,5)),
			                   testresultid=tr.id,
			                   questionid=q.id)
			db.session.add(mark)
		db.session.commit()

users = models.User.query.all()
for u in users:
	fields = models.Field.query.all()
	for f in fields:
		uxq = models.UserxField(
			userid=u.id,
			fieldid=f.id
			)
		db.session.add(uxq)
db.session.commit()